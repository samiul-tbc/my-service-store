'use client';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

// Privacy / Terms / Refund / FAQ পেজগুলোর শেয়ার্ড লেআউট (দ্বিভাষিক)
// Props: bn / en — দুটোই { title, subtitle, updated, sections: [{ h, body: [] }] }
export default function PolicyPage({ bn, en }) {
  const { lang, t } = useLanguage();
  const c = lang === 'en' ? en : bn;
  const { title, subtitle, updated, sections } = c;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '22px 16px 30px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#f8fafc', margin: '0 0 6px', letterSpacing: '-0.4px' }}>
        {title}
      </h1>
      {subtitle && <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#94a3b8' }}>{subtitle}</p>}
      {updated && (
        <p style={{ margin: '0 0 22px', fontSize: '11px', color: '#64748b' }}>
          {t.policyUi.lastUpdated} {updated}
        </p>
      )}

      {sections.map((sec) => (
        <section
          key={sec.h}
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '16px',
            padding: '16px 18px',
            marginBottom: '12px',
          }}
        >
          <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#f8fafc', margin: '0 0 8px' }}>{sec.h}</h2>
          {sec.body.map((line, i) => (
            <p key={i} style={{ margin: i === sec.body.length - 1 ? 0 : '0 0 8px', fontSize: '13px', lineHeight: 1.8, color: '#a7b1be' }}>
              {line}
            </p>
          ))}
        </section>
      ))}

      <p style={{ fontSize: '12px', color: '#64748b', marginTop: '18px' }}>
        {t.policyUi.needHelp}{' '}
        <Link href="/faq" style={{ color: '#a6f36a', textDecoration: 'none', fontWeight: '700' }}>
          {t.policyUi.seeFaq}
        </Link>{' '}
        {t.policyUi.orMsg}
      </p>
    </div>
  );
}
