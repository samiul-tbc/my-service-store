'use client';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: 'rgba(30, 41, 59, 0.75)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '20px',
      padding: '3px',
      gap: '3px',
    }}>
      <button
        type="button"
        onClick={() => toggleLanguage('bn')}
        style={{
          background: lang === 'bn' ? '#2563eb' : 'transparent',
          color: lang === 'bn' ? '#ffffff' : '#94a3b8',
          border: 'none',
          borderRadius: '14px',
          padding: '4px 9px',
          fontSize: '11px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        🇧🇩 BN
      </button>

      <button
        type="button"
        onClick={() => toggleLanguage('en')}
        style={{
          background: lang === 'en' ? '#2563eb' : 'transparent',
          color: lang === 'en' ? '#ffffff' : '#94a3b8',
          border: 'none',
          borderRadius: '14px',
          padding: '4px 9px',
          fontSize: '11px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
