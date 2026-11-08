'use client';

import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { GUIDES } from '../../lib/guides';
import Icon from '../../components/icons';

export default function GuideIndexPage() {
  const { t, lang } = useLanguage();
  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '28px 16px 110px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#f8fafc', margin: '0 0 8px' }}>{t.guide.title}</h1>
      <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 26px', lineHeight: 1.6 }}>{t.guide.sub}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px' }}>
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/guide/${g.slug}`} style={{ textDecoration: 'none', background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px', display: 'block', backdropFilter: 'blur(14px)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(166, 243, 106, 0.12)', border: '1px solid rgba(166, 243, 106, 0.3)', marginBottom: '12px' }}>
              <Icon name="book" size={19} color="#a6f36a" />
            </span>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#f8fafc', margin: '0 0 6px', lineHeight: 1.4 }}>{g.title[lang] || g.title.bn}</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 12px', lineHeight: 1.6 }}>{g.excerpt[lang] || g.excerpt.bn}</p>
            <span style={{ fontSize: '12px', color: '#a6f36a', fontWeight: '700' }}>{t.guide.minRead.replace('{n}', String(g.mins))}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
