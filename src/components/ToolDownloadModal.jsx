import { useState, useEffect, useRef } from 'react';
import { apiBaseUrl } from '../config';

/**
 * Modal that captures an email before triggering a tool file download.
 *
 * Props:
 *   tool    — { id: string, title: string }
 *   onClose — () => void
 */
export default function ToolDownloadModal({ tool, onClose }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);
  const overlayRef = useRef(null);

  // Focus email input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

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

      // Trigger file download via invisible anchor click
      triggerDownload(`${base}${data.downloadUrl}`, tool.title);
      setStatus('success');
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tool-modal-title"
    >
      <div
        style={{
          background: `
            radial-gradient(
              ellipse 120% 80% at 50% 20%,
              rgba(0, 123, 255, 0.45) 0%,
              rgba(0, 100, 220, 0.2) 35%,
              rgba(0, 70, 180, 0.06) 60%,
              transparent 85%
            ),
            #000000
          `,
          border: '1px solid hsl(var(--border))',
          borderRadius: 'var(--radius)',
          padding: '2rem',
          width: '100%',
          maxWidth: '440px',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'hsl(0, 0%, 62%)',
            fontSize: '1.125rem',
            lineHeight: 1,
            padding: '0.25rem 0.5rem',
          }}
        >
          &#x2715;
        </button>

        {status !== 'success' ? (
          <>
            <h3
              id="tool-modal-title"
              style={{ marginBottom: '0.5rem', color: 'hsl(0, 0%, 100%)', marginTop: 0 }}
            >
              Get the {tool.title}
            </h3>
            <p
              style={{
                color: 'hsl(0, 0%, 62%)',
                marginBottom: '1.5rem',
                fontSize: '0.9375rem',
                lineHeight: 1.5,
                marginTop: 0,
              }}
            >
              Enter your email and we&apos;ll start the download immediately.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <label
                htmlFor="tool-email"
                style={{
                  display: 'block',
                  marginBottom: '0.375rem',
                  fontSize: '0.875rem',
                  color: 'hsl(0, 0%, 80%)',
                }}
              >
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
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--input, 220 13% 12%))',
                  color: 'hsl(0, 0%, 100%)',
                  fontSize: '1rem',
                  marginBottom: status === 'error' ? '0.5rem' : '1rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                  opacity: status === 'loading' ? 0.6 : 1,
                }}
              />

              {status === 'error' && (
                <p
                  style={{
                    color: '#f87171',
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    marginTop: 0,
                  }}
                >
                  {errorMsg}
                </p>
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
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h3
              id="tool-modal-title"
              style={{ marginBottom: '0.5rem', color: 'hsl(0, 0%, 100%)', marginTop: 0 }}
            >
              Download started!
            </h3>
            <p
              style={{
                color: 'hsl(0, 0%, 100%)',
                marginBottom: '1.5rem',
                fontSize: '0.9375rem',
                lineHeight: 1.5,
                marginTop: 0,
              }}
            >
              Check your downloads folder for{' '}
              <strong>{tool.title}</strong>.
            </p>
            <button onClick={onClose} className="btn ghost">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
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
