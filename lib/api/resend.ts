import { Resend } from 'resend';
import type { ToolConfig } from '@/lib/data/tool-config';

let client: Resend | null = null;

function getClient(): Resend | null {
  if (client) return client;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  client = new Resend(apiKey);
  return client;
}

function buildDownloadUrl(token: string): string {
  const host =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://joindatalyze.com';
  return `${host}/api/tool-downloads/file/${token}`;
}

function buildEmailHtml(tool: ToolConfig, token: string): string {
  const downloadUrl = buildDownloadUrl(token);
  return `<!DOCTYPE html>
<html>
  <body style="font-family: system-ui, -apple-system, sans-serif; background: #0a0a0b; color: #fafaf9; padding: 40px 24px; margin: 0;">
    <div style="max-width: 560px; margin: 0 auto;">
      <div style="display: inline-block; width: 12px; height: 12px; background: #D4FF3F; vertical-align: middle; margin-right: 8px;"></div>
      <span style="font-family: 'Times New Roman', serif; font-size: 28px; color: #fafaf9; vertical-align: middle;">Datalyze</span>
      <h1 style="color: #fafaf9; font-size: 28px; margin-top: 32px; margin-bottom: 8px; font-weight: 400; font-family: 'Times New Roman', serif;">
        Your ${tool.label} is ready
      </h1>
      <p style="color: #a8a8ad; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
        ${tool.description}
      </p>
      <p style="color: #a8a8ad; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        Your download should have started automatically - here&apos;s the link to download it again:
        <a href="${downloadUrl}" style="color: #D4FF3F; text-decoration: none;">Download ${tool.label}</a>
      </p>
      <p style="color: #a8a8ad; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
        Need a custom tool, or help with analytics for your product? Feel free to
        <a href="https://joindatalyze.com/contact" style="color: #D4FF3F; text-decoration: none;">book a call with Ansh</a>
        to see how we can help you.
      </p>
      <p style="color: #a8a8ad; font-size: 14px; line-height: 1.6;">
        Questions? Reply to this email or reach us at
        <a href="mailto:ansh@joindatalyze.com" style="color: #D4FF3F; text-decoration: none;">ansh@joindatalyze.com</a>
      </p>
      <hr style="border: none; border-top: 1px solid #26262c; margin: 32px 0;" />
      <p style="color: #6f6f76; font-size: 12px; margin: 0;">
        Datalyze - Analytics &amp; growth partner.
      </p>
    </div>
  </body>
</html>`;
}

function buildEmailText(tool: ToolConfig, token: string): string {
  const downloadUrl = buildDownloadUrl(token);
  return `Your ${tool.label} is ready\n\n${tool.description}\n\nYour download should have started automatically - here's the link to download it again:\n${downloadUrl}\n\nNeed a custom tool, or help with analytics for your product? Feel free to book a call with Ansh: https://joindatalyze.com/contact\n\nQuestions? Reply to this email or reach us at ansh@joindatalyze.com\n\n-- Datalyze`;
}

export async function sendToolDownloadEmail(
  tool: ToolConfig,
  email: string,
  token: string,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const resend = getClient();
  if (!resend) {
    return { ok: false, error: 'RESEND_API_KEY not set' };
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const { data, error } = await resend.emails.send({
    from: `Datalyze <${fromEmail}>`,
    to: email,
    subject: `Your ${tool.label} is ready`,
    html: buildEmailHtml(tool, token),
    text: buildEmailText(tool, token),
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data?.id };
}
