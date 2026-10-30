'use client';
import Link from 'next/link';

const CATEGORIES = [
  { 
    id: 'android-root', 
    name: 'Android Root', 
    icon: '⚡', 
    desc: 'Magisk, KernelSU ও পার্মানেন্ট রুট সার্ভিস' 
  },
  { 
    id: 'android-panel', 
    name: 'Android Panel', 
    icon: '📱', 
    desc: 'অ্যান্ড্রয়েড কন্ট্রোল প্যানেল ও কাস্টম ইউটিলিটি' 
  },
  { 
    id: 'social-package', 
    name: 'Social Package', 
    icon: '🚀', 
    desc: 'সোশ্যাল মিডিয়া প্রোমোশন ও গ্রোথ প্যাকেজ' 
  },
  { 
    id: 'subscriptions', 
    name: 'Subscriptions', 
    icon: '💎', 
    desc: 'প্রিমিয়াম অ্যাপ ও সফটওয়্যার সাবস্ক্রিপশন' 
  },
];

export default function CategoriesPage() {
  return (
    <div style={{ padding: '16px 14px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '14px', color: '#0f172a' }}>সকল ক্যাটাগরি</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {CATEGORIES.map((cat) => (
          <Link 
            key={cat.id} 
            href={`/?cat=${cat.id}`} 
            style={{ textDecoration: 'none', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
          >
            <div style={{ fontSize: '28px', background: '#eff6ff', padding: '10px 12px', borderRadius: '12px' }}>
              {cat.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 4px', color: '#0f172a' }}>{cat.name}</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{cat.desc}</p>
            </div>
            <span style={{ color: '#94a3b8', fontSize: '18px', fontWeight: 'bold' }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
