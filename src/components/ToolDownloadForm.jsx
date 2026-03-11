import { useState, useRef, useEffect } from 'react';
import { apiBaseUrl } from '../config';
import mixpanel from '../utils/mixpanel';

export default function ToolDownloadForm({ tool, autoFocus = false }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const base = apiBaseUrl || '';
      const res = await fetch(`${base}/api/tool-downloads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), toolId: tool.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data?.details?.[0]?.message ||
          data?.error ||
          'Something went wrong. Please try again.';
        setErrorMsg(msg);
        setStatus('error');
        return;
      }

      mixpanel.identify(email.trim());
      mixpanel.people.set({ $email: email.trim() });
      mixpanel.track('Email Submitted', { tool_id: tool.id, email: email.trim() });
      triggerDownload(`${base}${data.downloadUrl}`, tool.title);
      setStatus('success');
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="tool-download-success">
        <h3>Download started!</h3>
        <p>
          Check your downloads folder for <strong>{tool.title}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="tool-download-form">
      <label htmlFor="tool-email" className="tool-download-label">
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
        className="tool-download-input"
      />

      {status === 'error' && (
        <p className="tool-download-error">{errorMsg}</p>
      )}

      <button
        type="submit"
        className="btn primary"
        disabled={status === 'loading'}
        style={{ width: '100%' }}
      >
        {status === 'loading' ? 'Starting download\u2026' : 'Download the tool'}
      </button>
    </form>
  );
}

function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
