import { useEffect, useRef } from 'react';
import ToolDownloadForm from './ToolDownloadForm';

/**
 * Modal that captures an email before triggering a tool file download.
 *
 * Props:
 *   tool    — { id: string, title: string }
 *   onClose — () => void
 */
export default function ToolDownloadModal({ tool, onClose }) {
  const overlayRef = useRef(null);

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
            fontSize: 'var(--font-subheading)',
            lineHeight: 1,
            padding: '0.25rem 0.5rem',
          }}
        >
          &#x2715;
        </button>

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
            fontSize: 'var(--font-paragraph)',
            lineHeight: 'var(--lh-paragraph)',
            marginTop: 0,
          }}
        >
          Enter your email and we&apos;ll start the download immediately.
        </p>

        <ToolDownloadForm tool={tool} autoFocus />
      </div>
    </div>
  );
}
