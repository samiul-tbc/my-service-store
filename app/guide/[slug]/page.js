'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import { GUIDES } from '../../../lib/guides';
import Icon from '../../../components/icons';

export default function GuideArticlePage() {
  const params = useParams();
  const { t, lang } = useLanguage();
  const guide = GUIDES.find((g) => g.slug === params?.slug);

  if (!guide) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 16px 110px', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '15px' }}>404</p>
        <Link href="/guide" style={{ color: '#a6f36a', fontWeight: '700', textDecoration: 'none' }}>{t.guide.back}</Link>
      </div>
    );
  }

  const blocks = guide.body[lang] || guide.body.bn;
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px 110px' }}>
      <Link href="/guide" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#a6f36a', fontSize: '13px', fontWeight: '700', textDecoration: 'none', marginBottom: '18px' }}>
        <Icon name="arrowLeft" size={15} color="#a6f36a" /> {t.guide.back}
      </Link>
      <h1 style={{ fontSize: '25px', fontWeight: '900', color: '#f8fafc', margin: '0 0 8px', lineHeight: 1.35 }}>{guide.title[lang] || guide.title.bn}</h1>
      <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 24px' }}>{t.guide.minRead.replace('{n}', String(guide.mins))}</p>
      <div>
        {blocks.map((b, i) => {
          if (b.h) return <h2 key={i} style={{ fontSize: '17px', fontWeight: '800', color: '#f8fafc', margin: '24px 0 8px' }}>{b.h}</h2>;
          if (b.list) return (
            <ul key={i} style={{ margin: '8px 0', paddingLeft: '20px', color: '#cbd5e1', fontSize: '14px', lineHeight: 1.75 }}>
              {b.list.map((item, j) => <li key={j} style={{ marginBottom: '4px' }}>{item}</li>)}
            </ul>
          );
          return <p key={i} style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 12px' }}>{b.p}</p>;
        })}
      </div>
      <div style={{ marginTop: '34px', background: 'rgba(166, 243, 106, 0.07)', border: '1px solid rgba(166, 243, 106, 0.3)', borderRadius: '18px', padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: '800', color: '#f8fafc', marginBottom: '10px' }}>{t.guide.ctaTitle}</div>
        <Link href="/categories" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #a6f36a, #d2ffad)', color: '#10170c', fontWeight: '900', fontSize: '13px', padding: '11px 22px', borderRadius: '12px', textDecoration: 'none' }}>{t.guide.ctaSub}</Link>
      </div>
    </div>
  );
}
