import { NextResponse, after } from 'next/server';
import { TOOL_CONFIG } from '@/lib/data/tool-config';
import { insertToolDownload, markToolDownloadEmailSent } from '@/lib/api/bigquery';
import {
  generateDownloadToken,
  getTokenExpiry,
} from '@/lib/api/download-token';
import { sendToolDownloadEmail } from '@/lib/api/resend';
import { addGhostMember } from '@/lib/api/ghost';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = { email?: unknown; toolId?: unknown };

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const rawEmail =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const rawToolId = typeof body.toolId === 'string' ? body.toolId.trim() : '';

  if (!rawEmail || !EMAIL_RE.test(rawEmail)) {
    return NextResponse.json(
      { error: 'Valid email required' },
      { status: 400 },
    );
  }

  const tool = TOOL_CONFIG[rawToolId];
  if (!tool) {
    return NextResponse.json({ error: 'Invalid tool ID' }, { status: 400 });
  }

  const token = generateDownloadToken(rawEmail, rawToolId);
  const expiresAt = getTokenExpiry();

  try {
    await insertToolDownload({
      email: rawEmail,
      tool_id: rawToolId,
      download_token: token,
      token_expires_at: expiresAt,
    });
  } catch (err) {
    console.error(
      '[tool-downloads] BigQuery insert failed:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again later.' },
      { status: 503 },
    );
  }

  // Non-blocking side effects run after the response has streamed back.
  if (!tool.webOnly) {
    after(async () => {
      const result = await sendToolDownloadEmail(tool, rawEmail, token);
      if (!result.ok) {
        console.warn('[tool-downloads] Email send failed:', result.error);
        return;
      }
      try {
        await markToolDownloadEmailSent(token);
      } catch (err) {
        console.warn(
          '[tool-downloads] BigQuery email_sent update failed:',
          err instanceof Error ? err.message : err,
        );
      }
    });
  }

  after(async () => {
    try {
      await addGhostMember(rawEmail);
    } catch (err) {
      console.warn(
        '[tool-downloads] Ghost member sync failed:',
        err instanceof Error ? err.message : err,
      );
    }
  });

  return NextResponse.json(
    {
      ok: true,
      token,
      downloadUrl: `/api/tool-downloads/file/${token}`,
    },
    { status: 201 },
  );
}
