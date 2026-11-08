'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const DISMISS_KEY = 'hubcart_pwa_dismissed';

// Slim liquid-glass "install app" banner. Shows only when the browser offers
// an install prompt (beforeinstallprompt) and the user hasn't dismissed it.
export default function PwaBanner() {
  const { t } = useLanguage();
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return;
    const handler = (e) => {
      e.preventDefault();
      setDeferred(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch {}
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    try {
      deferred.prompt();
      await deferred.userChoice;
    } catch {}
    dismiss();
  };

  return (
    <div style={{
      position: 'fixed', left: '12px', right: '12px', bottom: '84px', zIndex: 60,
      maxWidth: '520px', margin: '0 auto',
      display: 'flex', alignItems: 'center', gap: '12px',
      background: 'linear-gradient(180deg, rgba(20, 28, 44, 0.82), rgba(10, 14, 22, 0.78))',
      backdropFilter: 'blur(22px) saturate(180%)', WebkitBackdropFilter: 'blur(22px) saturate(180%)',
      border: '1px solid rgba(166, 243, 106, 0.3)', borderRadius: '18px',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 18px 42px rgba(0,0,0,0.5)',
      padding: '12px 14px',
    }}>
      <img src="/logo-icon.png" alt="" style={{ width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: '800', color: '#f8fafc' }}>{t.shop.pwaTitle}</div>
        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.5 }}>{t.shop.pwaSub}</div>
      </div>
      <button onClick={install} style={{ flexShrink: 0, padding: '9px 14px', borderRadius: '11px', border: 'none', background: 'linear-gradient(135deg, #a6f36a, #d2ffad)', color: '#10170c', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}>
        {t.shop.pwaInstall}
      </button>
      <button onClick={dismiss} aria-label={t.shop.pwaLater} style={{ flexShrink: 0, background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer', padding: '4px' }}>
        ✕
      </button>
    </div>
  );
}
