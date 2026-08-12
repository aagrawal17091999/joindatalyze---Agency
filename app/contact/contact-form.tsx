'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { track, identify } from '@/lib/mixpanel';

type Status = 'idle' | 'loading' | 'error';
type Field = 'name' | 'email' | 'website' | 'goal';

const FIELD_ORDER: Field[] = ['name', 'email', 'website', 'goal'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCATION = 'contact_page';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [goal, setGoal] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Timing baselines (high-res, browser-local).
  const mountTimeRef = useRef(0);
  const firstInputTimeRef = useRef<number | null>(null);

  // Lifecycle guards so each signal fires at most once per visit.
  const startedRef = useRef(false);
  const submittedRef = useRef(false);
  const abandonedRef = useRef(false);
  const redirectedRef = useRef(false);

  // Per-field engagement state, kept in refs so the unload handler can read the
  // latest values without re-subscribing.
  const focusCountRef = useRef<Partial<Record<Field, number>>>({});
  const editedFieldsRef = useRef<Set<Field>>(new Set());
  const completedFieldsRef = useRef<Set<Field>>(new Set());
  const furthestIndexRef = useRef(-1);
  const furthestFieldRef = useRef<Field | null>(null);

  useEffect(() => {
    mountTimeRef.current = performance.now();
    track('Contact Form Viewed', { location: LOCATION });
  }, []);

  // Abandonment: fire once when the visitor leaves after engaging but before a
  // successful submit. visibilitychange(hidden) + pagehide cover tab-close,
  // navigation and mobile background; sendBeacon gives it the best shot at
  // landing on unload. Continuous Field Completed events are the backstop if
  // this one is dropped.
  useEffect(() => {
    const fireAbandon = () => {
      if (!startedRef.current || submittedRef.current || abandonedRef.current) {
        return;
      }
      abandonedRef.current = true;
      track(
        'Contact Form Abandoned',
        {
          location: LOCATION,
          furthest_field: furthestFieldRef.current,
          completed_fields: Array.from(completedFieldsRef.current),
          completed_count: completedFieldsRef.current.size,
          time_on_form_ms: Math.round(performance.now() - mountTimeRef.current),
        },
        { transport: 'sendBeacon' },
      );
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') fireAbandon();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', fireAbandon);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', fireAbandon);
    };
  }, []);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    firstInputTimeRef.current = performance.now();
    track('Contact Form Started', { location: LOCATION });
  };

  const handleFocus = (field: Field) => {
    markStarted();
    const idx = FIELD_ORDER.indexOf(field);
    if (idx > furthestIndexRef.current) {
      furthestIndexRef.current = idx;
      furthestFieldRef.current = field;
    }
    const count = (focusCountRef.current[field] ?? 0) + 1;
    focusCountRef.current[field] = count;
    if (count === 1) {
      track('Contact Field Focused', { field, location: LOCATION });
    } else {
      track('Contact Field Refocused', {
        field,
        visit_count: count,
        location: LOCATION,
      });
    }
  };

  const handleEdit = (field: Field) => {
    markStarted();
    if (editedFieldsRef.current.has(field)) return;
    editedFieldsRef.current.add(field);
    track('Contact Field Edited', { field, location: LOCATION });
  };

  const handlePaste = (field: Field) => {
    track('Contact Field Pasted', { field, location: LOCATION });
  };

  const handleBlur = (field: Field, value: string) => {
    const trimmed = value.trim();
    if (!trimmed || completedFieldsRef.current.has(field)) return;
    completedFieldsRef.current.add(field);
    track('Contact Field Completed', {
      field,
      char_count: trimmed.length,
      location: LOCATION,
    });
  };

  const redirectToCalendly = (url: string) => {
    if (redirectedRef.current) return;
    redirectedRef.current = true;
    window.location.href = url;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      track('Contact Form Validation Error', {
        field: 'name',
        reason: 'missing',
        location: LOCATION,
      });
      setErrorMsg('Please enter your name.');
      setStatus('error');
      return;
    }
    if (!trimmedEmail || !EMAIL_RE.test(trimmedEmail)) {
      track('Contact Form Validation Error', {
        field: 'email',
        reason: trimmedEmail ? 'invalid_email' : 'missing',
        location: LOCATION,
      });
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    const now = performance.now();
    const funnelProps = {
      location: LOCATION,
      completed_fields: Array.from(completedFieldsRef.current),
      completed_count: completedFieldsRef.current.size,
      completed_optional: website.trim().length > 0,
      time_to_first_input_ms: firstInputTimeRef.current
        ? Math.round(firstInputTimeRef.current - mountTimeRef.current)
        : null,
      time_to_submit_ms: Math.round(now - mountTimeRef.current),
    };

    setStatus('loading');
    setErrorMsg('');
    track('Contact Form Submitted', funnelProps);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          website: website.trim(),
          goal: goal.trim(),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        schedulingUrl?: string;
      };

      if (!res.ok || !data.schedulingUrl) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      // Mark submitted so the redirect's own pagehide doesn't log an abandon.
      submittedRef.current = true;
      identify(trimmedEmail);

      // Redirect on the Mixpanel callback so the conversion event flushes before
      // we leave the page, with a timeout fallback if the callback never fires.
      const url = data.schedulingUrl;
      track('Contact Lead Captured', funnelProps, () =>
        redirectToCalendly(url),
      );
      setTimeout(() => redirectToCalendly(url), 1200);
    } catch {
      setErrorMsg(
        'Network error. Please check your connection and try again.',
      );
      setStatus('error');
    }
  };

  const disabled = status === 'loading';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        width: '100%',
        maxWidth: 520,
        margin: '0 auto',
      }}
    >
      <div className="form-field">
        <label htmlFor="contact-name" className="form-label">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            handleEdit('name');
          }}
          onFocus={() => handleFocus('name')}
          onBlur={(e) => handleBlur('name', e.target.value)}
          onPaste={() => handlePaste('name')}
          placeholder="Jane Doe"
          autoComplete="name"
          required
          disabled={disabled}
          className="form-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="contact-email" className="form-label">
          Work email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            handleEdit('email');
          }}
          onFocus={() => handleFocus('email')}
          onBlur={(e) => handleBlur('email', e.target.value)}
          onPaste={() => handlePaste('email')}
          placeholder="you@company.com"
          autoComplete="email"
          required
          disabled={disabled}
          className="form-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="contact-website" className="form-label">
          Company website <span style={{ opacity: 0.6 }}>(optional)</span>
        </label>
        <input
          id="contact-website"
          type="text"
          value={website}
          onChange={(e) => {
            setWebsite(e.target.value);
            handleEdit('website');
          }}
          onFocus={() => handleFocus('website')}
          onBlur={(e) => handleBlur('website', e.target.value)}
          onPaste={() => handlePaste('website')}
          placeholder="company.com"
          autoComplete="url"
          disabled={disabled}
          className="form-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="contact-goal" className="form-label">
          How can I help you? Please share some context so that I can come
          prepared.
        </label>
        <textarea
          id="contact-goal"
          value={goal}
          onChange={(e) => {
            setGoal(e.target.value);
            handleEdit('goal');
          }}
          onFocus={() => handleFocus('goal')}
          onBlur={(e) => handleBlur('goal', e.target.value)}
          onPaste={() => handlePaste('goal')}
          placeholder="e.g. our attribution numbers don't match across tools"
          rows={3}
          disabled={disabled}
          className="form-input"
          style={{ resize: 'vertical', minHeight: 88 }}
        />
      </div>

      {status === 'error' ? <p className="form-error">{errorMsg}</p> : null}

      <button
        type="submit"
        className="btn-primary"
        disabled={disabled}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {disabled ? 'Taking you to the calendar…' : 'Pick a time →'}
      </button>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        You&apos;ll choose a time on the next step - your details are prefilled.
      </p>
    </form>
  );
}
