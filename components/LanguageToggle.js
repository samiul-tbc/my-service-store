'use client';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '20px',
      padding: '2px',
      gap: '2px',
    }}>
      <button
        type="button"
        onClick={() => toggleLanguage('bn')}
        style={{
          background: lang === 'bn' ? '#a6f36a' : 'transparent',
          color: lang === 'bn' ? '#ffffff' : '#94a3b8',
          border: 'none',
          borderRadius: '14px',
          padding: '4px 8px',
          fontSize: '11px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        🇧🇩 BN
      </button>

      <button
        type="button"
        onClick={() => toggleLanguage('en')}
        style={{
          background: lang === 'en' ? '#a6f36a' : 'transparent',
          color: lang === 'en' ? '#ffffff' : '#94a3b8',
          border: 'none',
          borderRadius: '14px',
          padding: '4px 8px',
          fontSize: '11px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
