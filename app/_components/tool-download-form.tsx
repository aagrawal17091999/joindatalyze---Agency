'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { track, identify } from '@/lib/mixpanel';
import type { Tool } from '@/lib/data/tools';

type Props = {
  tool: Tool;
  autoFocus?: boolean;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function ToolDownloadForm({ tool, autoFocus = false }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/tool-downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, toolId: tool.id }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        downloadUrl?: string;
      };

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      identify(trimmed);
      track('Email Submitted', { tool_id: tool.id, email: trimmed });

      if (data.downloadUrl) {
        triggerDownload(data.downloadUrl, tool.title);
      }
      setStatus('success');
    } catch {
      setErrorMsg(
        'Network error. Please check your connection and try again.',
      );
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-display), serif',
            fontSize: '24px',
            color: 'var(--text-primary)',
          }}
        >
          Download started!
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-3)' }}>
          Check your downloads folder for <strong>{tool.title}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
    >
      <div className="form-field">
        <label htmlFor="tool-email" className="form-label">
          Email address
        </label>
        <input
          ref={inputRef}
          id="tool-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          disabled={status === 'loading'}
          className="form-input"
        />
      </div>

      {status === 'error' ? <p className="form-error">{errorMsg}</p> : null}

      <button
        type="submit"
        className="btn-primary"
        disabled={status === 'loading'}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {status === 'loading' ? 'Starting download…' : 'Download the tool'}
      </button>
    </form>
  );
}
