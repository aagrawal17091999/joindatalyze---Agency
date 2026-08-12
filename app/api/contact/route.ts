import { NextResponse, after } from 'next/server';
import { insertContactLead } from '@/lib/api/bigquery';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Full-page Calendly scheduling link. We redirect the browser here (top-level,
// first-party) instead of embedding an iframe - the ad-blocker / third-party
// storage failures that blank out the inline embed don't apply to a top-level
// navigation to calendly.com, so this loads reliably for privacy-heavy visitors.
const CALENDLY_BASE = 'https://calendly.com/ansh-datalyze/chat';

type Body = {
  name?: unknown;
  email?: unknown;
  website?: unknown;
  goal?: unknown;
};

// Calendly prefills its booking form from URL params: `name` and `email` map to
// the invitee fields; `a1` maps to the first custom question on the event type.
function buildSchedulingUrl(name: string, email: string, goal: string): string {
  const params = new URLSearchParams({ hide_gdpr_banner: '1' });
  if (name) params.set('name', name);
  if (email) params.set('email', email);
  if (goal) params.set('a1', goal);
  return `${CALENDLY_BASE}?${params.toString()}`;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const website = typeof body.website === 'string' ? body.website.trim() : '';
  const goal = typeof body.goal === 'string' ? body.goal.trim() : '';

  if (!name) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  const schedulingUrl = buildSchedulingUrl(name, email, goal);

  // Capture is best-effort and runs after the response streams back: we never
  // block (or fail) a booking on our own analytics store. A dropped row is
  // recoverable - the visitor is on their way to Calendly regardless.
  after(async () => {
    try {
      await insertContactLead({
        name,
        email,
        website: website || null,
        goal: goal || null,
        source: 'contact_page',
      });
    } catch (err) {
      console.error(
        '[contact] BigQuery insert failed:',
        err instanceof Error ? err.message : err,
      );
    }
  });

  return NextResponse.json({ ok: true, schedulingUrl }, { status: 201 });
}
