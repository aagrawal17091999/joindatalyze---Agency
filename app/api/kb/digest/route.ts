import { buildDigest, formatDigest, sendDigest } from '@/lib/kb/digest';

// Weekly refused-query digest. Cron: Mondays after the sync (see vercel.ts).
//
// ?dry=1 returns the digest without emailing - useful for checking the
// clustering threshold without spamming yourself.

export const maxDuration = 120;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== 'production';
  return request.headers.get('authorization') === `Bearer ${secret}`;
}

async function run(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const days = Number(url.searchParams.get('days') ?? 7);
  const dry = url.searchParams.get('dry') === '1';

  try {
    const digest = await buildDigest(days);
    const { subject, text } = formatDigest(digest);
    const sent = dry ? false : await sendDigest(digest);
    return Response.json({ ok: true, sent, subject, text, digest });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[kb/digest] failed:', err);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export const GET = run;
export const POST = run;
