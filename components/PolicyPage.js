import Link from 'next/link';

// Privacy / Terms / Refund / FAQ পেজগুলোর শেয়ার্ড লেআউট
// sections: [{ h: 'শিরোনাম', body: ['অনুচ্ছেদ ১', 'অনুচ্ছেদ ২'] }]
export default function PolicyPage({ title, subtitle, updated, sections }) {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '22px 16px 30px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#f8fafc', margin: '0 0 6px', letterSpacing: '-0.4px' }}>
        {title}
      </h1>
      {subtitle && <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#94a3b8' }}>{subtitle}</p>}
      {updated && <p style={{ margin: '0 0 22px', fontSize: '11px', color: '#64748b' }}>সর্বশেষ হালনাগাদ: {updated}</p>}

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
        আরও সাহায্য দরকার?{' '}
        <Link href="/faq" style={{ color: '#a6f36a', textDecoration: 'none', fontWeight: '700' }}>
          FAQ দেখুন
        </Link>{' '}
        অথবা ফুটারের WhatsApp Support লিংক থেকে আমাদের মেসেজ করুন।
      </p>
    </div>
  );
}
