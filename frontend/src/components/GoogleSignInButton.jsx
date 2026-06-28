import { useEffect, useRef, useState } from 'react';

const GSI_SCRIPT = 'https://accounts.google.com/gsi/client';

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GSI_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      return;
    }
    const script = document.createElement('script');
    script.src = GSI_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In'));
    document.head.appendChild(script);
  });
}

export default function GoogleSignInButton({ onSuccess, onError, text = 'signin_with', disabled = false }) {
  const buttonRef = useRef(null);
  const [ready, setReady] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || disabled) return;

    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              onSuccess?.(response.credential);
            } else {
              onError?.(new Error('No credential received from Google'));
            }
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          width: buttonRef.current.offsetWidth || 380,
        });

        setReady(true);
      })
      .catch((err) => onError?.(err));

    return () => {
      cancelled = true;
    };
  }, [clientId, disabled, onSuccess, onError, text]);

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        title="Set VITE_GOOGLE_CLIENT_ID in frontend/.env"
        style={{
          width: '100%',
          padding: '12px',
          background: 'rgba(255,255,255,0.08)',
          color: 'rgba(232,244,240,0.5)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '8px',
          cursor: 'not-allowed',
          fontSize: '14px',
        }}
      >
        Google Sign-In (configure Client ID)
      </button>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: 44, opacity: ready ? 1 : 0.5 }}>
      <div ref={buttonRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
    </div>
  );
}
