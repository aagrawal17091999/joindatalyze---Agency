import { Router } from 'express';
import { createHmac, randomBytes } from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createReadStream, existsSync } from 'fs';
import { Resend } from 'resend';
import { body } from 'express-validator';
import { insertToolDownload, markToolDownloadEmailSent } from '../config/bigquery.js';
import { handleValidationErrors } from '../middleware/validate.js';
import { rateLimitStrict } from '../middleware/security.js';

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Single source of truth for all tools.
// To add a new tool: add an entry here and drop the file in public/tools/
const TOOL_CONFIG = {
  'mixpanel-exporter': {
    filename: 'mixpanel-event-exporter.ipynb',
    label: 'Mixpanel Event Exporter',
    description: 'Download raw Mixpanel data from your project in a CSV.',
  },
  'mixpanel-users-exporter': {
    filename: 'mixpanel-users-exporter.ipynb',
    label: 'Mixpanel Users Exporter',
    description: 'Download raw Mixpanel user profile data from your project in a CSV.',
  },
  'analytics-maturity-grader': {
    label: 'Analytics Maturity Grader',
    description: 'A 2-minute quiz to grade your analytics maturity across 5 dimensions.',
    webOnly: true, // No file download — runs in the browser
  },
};

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function generateDownloadToken(email, toolId) {
  const secret = process.env.TOOL_DOWNLOAD_TOKEN_SECRET || 'dev-secret-change-in-production';
  const payload = `${email}:${toolId}:${Date.now()}:${randomBytes(8).toString('hex')}`;
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64url') + '.' + sig.slice(0, 32);
}

/**
 * Verify a download token by checking its HMAC signature and TTL.
 * Returns { email, toolId } on success, or null if invalid/expired.
 *
 * This avoids a BigQuery read (streaming inserts have eventual consistency),
 * while still being cryptographically secure.
 */
function verifyDownloadToken(token) {
  const secret = process.env.TOOL_DOWNLOAD_TOKEN_SECRET || 'dev-secret-change-in-production';
  const dotIdx = token.lastIndexOf('.');
  if (dotIdx === -1) return null;

  const encodedPayload = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);

  const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  const expectedSig = createHmac('sha256', secret).update(payload).digest('hex').slice(0, 32);

  if (sig !== expectedSig) return null;

  const parts = payload.split(':');
  if (parts.length < 4) return null;

  const [email, toolId, timestamp] = parts;
  if (Date.now() - parseInt(timestamp, 10) > TOKEN_TTL_MS) return null;

  return { email, toolId };
}

const toolDownloadValidators = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('toolId')
    .trim()
    .isIn(Object.keys(TOOL_CONFIG))
    .withMessage('Invalid tool ID'),
];

router.use(rateLimitStrict);

// POST / — Capture email, store in BigQuery, send confirmation email, return download token
router.post(
  '/',
  toolDownloadValidators,
  handleValidationErrors,
  async (req, res) => {
    const { email, toolId } = req.body;
    const tool = TOOL_CONFIG[toolId];

    const token = generateDownloadToken(email, toolId);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    try {
      await insertToolDownload({
        email,
        tool_id: toolId,
        download_token: token,
        token_expires_at: expiresAt,
      });
    } catch (err) {
      console.error('[tool-downloads] BigQuery insert failed:', err.message);
      return res.status(503).json({
        error: 'Service temporarily unavailable. Please try again later.',
      });
    }

    // Send confirmation email — non-blocking, failure does not block the download
    // Skip for web-only tools (no file to download)
    if (!tool.webOnly) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      resend.emails.send({
        from: `Datalyze <${fromEmail}>`,
        to: email,
        subject: `Your ${tool.label} is ready`,
        html: buildEmailHtml(tool, token),
        text: buildEmailText(tool, token),
      }).then(({ data, error }) => {
        if (error) {
          console.warn('[tool-downloads] Email send failed:', error.message, error);
          return;
        }
        console.log('[tool-downloads] Email sent:', data?.id);
        // Mark email_sent in BigQuery — best-effort, non-blocking
        markToolDownloadEmailSent(token).catch((err) => {
          console.warn('[tool-downloads] BigQuery email_sent update failed:', err.message);
        });
      }).catch((emailErr) => {
        console.warn('[tool-downloads] Email send failed (network):', emailErr.message);
      });
    }

    // Sync to Ghost — non-blocking, failure does not block the download
    addGhostMember(email).catch((ghostErr) => {
      console.warn('[tool-downloads] Ghost member sync failed:', ghostErr.message);
    });

    return res.status(201).json({
      ok: true,
      token,
      downloadUrl: `/api/tool-downloads/file/${token}`,
    });
  }
);

// GET /file/:token — Verify token by HMAC signature and stream the tool file
router.get('/file/:token', (req, res) => {
  const { token } = req.params;

  const verified = verifyDownloadToken(token);
  if (!verified) {
    return res.status(410).json({ error: 'Invalid or expired download link. Please request a new one.' });
  }

  const tool = TOOL_CONFIG[verified.toolId];
  if (!tool) {
    return res.status(404).json({ error: 'Tool not found.' });
  }

  // Files live at: <project-root>/public/tools/<filename>
  // server/routes/ -> server/ -> <project-root>/
  const filePath = join(__dirname, '..', '..', 'public', 'tools', tool.filename);

  if (!existsSync(filePath)) {
    console.error('[tool-downloads] File not found at:', filePath);
    return res.status(404).json({ error: 'Tool file not found. Please contact support.' });
  }

  res.setHeader('Content-Disposition', `attachment; filename="${tool.filename}"`);
  const contentType = tool.filename.endsWith('.xlsx')
    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    : 'application/octet-stream';
  res.setHeader('Content-Type', contentType);

  createReadStream(filePath).pipe(res);
});

function buildEmailHtml(tool, token) {
  const downloadUrl = `https://api.joindatalyze.com/api/tool-downloads/file/${token}`;
  return `<!DOCTYPE html>
<html>
  <body style="font-family: system-ui, -apple-system, sans-serif; background: #0d0d0d; color: #ffffff; padding: 40px 24px; margin: 0;">
    <div style="max-width: 560px; margin: 0 auto;">
      <img src="https://joindatalyze.com/datalyze-logo.png" alt="Datalyze" style="height: 40px; margin-bottom: 32px;" />
      <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 8px; font-weight: 600;">
        Your ${tool.label} is ready
      </h1>
      <p style="color: #aaaaaa; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
        ${tool.description}
      </p>
      <p style="color: #aaaaaa; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        Your download should have started automatically — here's the link to download it again:
        <a href="${downloadUrl}" style="color: #a78bfa; text-decoration: none;">Download ${tool.label}</a>
      </p>
      <p style="color: #aaaaaa; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        Need a custom tool, or help with analytics for your product? Feel free to
        <a href="https://calendly.com/anshagrawal17091999/chat" style="color: #a78bfa; text-decoration: none;">book a call with Ansh</a>
        to see how we can help you.
      </p>
      <p style="color: #aaaaaa; font-size: 14px; line-height: 1.6;">
        Questions? Reply to this email or reach us at
        <a href="mailto:ansh@joindatalyze.com" style="color: #a78bfa; text-decoration: none;">ansh@joindatalyze.com</a>
      </p>
      <hr style="border: none; border-top: 1px solid #333; margin: 32px 0;" />
      <p style="color: #555555; font-size: 12px; margin: 0;">
        Datalyze &mdash; Analytics that actually moves the needle.
      </p>
    </div>
  </body>
</html>`;
}

function buildEmailText(tool, token) {
  const downloadUrl = `https://api.joindatalyze.com/api/tool-downloads/file/${token}`;
  return `Your ${tool.label} is ready\n\n${tool.description}\n\nYour download should have started automatically — here's the link to download it again:\n${downloadUrl}\n\nNeed a custom tool, or help with analytics for your product? Feel free to book a call with Ansh to see how we can help you: https://calendly.com/anshagrawal17091999/chat\n\nQuestions? Reply to this email or reach us at ansh@joindatalyze.com\n\n-- Datalyze`;
}

// Ghost Admin API — create a member so they receive future blog posts
function generateGhostJWT() {
  const adminKey = process.env.GHOST_ADMIN_API_KEY;
  if (!adminKey) throw new Error('GHOST_ADMIN_API_KEY is not set');
  const [keyId, secret] = adminKey.split(':');
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', kid: keyId, typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({ iat: now, exp: now + 300, aud: '/admin/' })).toString('base64url');
  const signingInput = `${header}.${payload}`;
  const secretBytes = Buffer.from(secret, 'hex');
  const sig = createHmac('sha256', secretBytes).update(signingInput).digest('base64url');
  return `${signingInput}.${sig}`;
}

async function addGhostMember(email) {
  const ghostUrl = process.env.GHOST_API_URL || 'https://datalyze.ghost.io';
  const token = generateGhostJWT();
  const res = await fetch(`${ghostUrl}/ghost/api/admin/members/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Ghost ${token}`,
    },
    body: JSON.stringify({ members: [{ email, subscribed: true }] }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // 422 with "Member already exists" is fine — not an error worth surfacing
    const err = body?.errors?.[0] || {};
    const msg = err.message || '';
    const ctx = err.context || '';
    if (res.status === 422 && (msg + ctx).toLowerCase().includes('already exists')) return;
    throw new Error(`Ghost API ${res.status}: ${msg}${ctx ? ` (${ctx})` : ''}`);
  }
}

export default router;
