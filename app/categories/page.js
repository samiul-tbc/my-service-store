'use client';
import Link from 'next/link';

const CATEGORIES = [
  { id: 'mobile', name: 'Mobile & Gadgets', icon: '💻📱', desc: 'স্মার্টফোন রুট ও ফার্মওয়্যার টুলস' },
  { id: 'tools', name: 'License & Tools', icon: '🔑', desc: 'অফিশিয়াল অ্যাক্টিভেশন কী' },
  { id: 'remote', name: 'Remote Support', icon: '🛠️', desc: 'লাইভ এনিডেস্ক সার্ভিস' },
];

export default function CategoriesPage() {
  return (
    <div style={{ padding: '16px 14px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '14px' }}>সকল ক্যাটাগরি</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {CATEGORIES.map((cat) => (
          <Link key={cat.id} href="/" style={{ textDecoration: 'none', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ fontSize: '30px', background: '#eff6ff', padding: '10px', borderRadius: '12px' }}>{cat.icon}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 4px', color: '#0f172a' }}>{cat.name}</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{cat.desc}</p>
            </div>
            <span style={{ color: '#94a3b8', fontSize: '18px' }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
