'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';

// Vercel Environment Variables থেকে ডাটা নেওয়া হচ্ছে
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

const CATEGORIES = [
  {
    id: 'all',
    name: 'All Services',
    desc: 'সব সার্ভিস ও টুলস',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ),
  },
  {
    id: 'android-root',
    name: 'Android Root',
    desc: 'রুট ও কার্নেল সার্ভিস',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
  },
  {
    id: 'android-panel',
    name: 'Android Panel',
    desc: 'মোবাইল কন্ট্রোল প্যানেল',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </svg>
    ),
  },
  {
    id: 'social-package',
    name: 'Social Boost',
    desc: 'সোশ্যাল মিডিয়া গ্রোথ প্যাকেজ',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
      </svg>
    ),
  },
  {
    id: 'subscriptions',
    name: 'VIP Subs',
    desc: 'প্রিমিয়াম ওটিটি ও অ্যাকাউন্ট',
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
      </svg>
    ),
  },
];

export default function CategoriesPage() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,title,price,original_price,category,image&order=id.desc`, {
          cache: 'no-store',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filtered = products.filter((p) => selectedCat === 'all' || p.category === selectedCat);

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '14px 14px 90px' }}>
      
      {/* হেডার */}
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#f8fafc', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
          Explore Categories
        </h1>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
          আপনার প্রয়োজনীয় ডিজিটাল সার্ভিস ক্যাটাগরি বেছে নিন
        </p>
      </div>

      {/* ক্যাটাগরি গ্রিড সিলেকশন */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '24px' }}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCat === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              style={{
                background: isSelected ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(15, 23, 42, 0.85) 100%)' : 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(12px)',
                border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 4px 15px rgba(56, 189, 248, 0.2)' : 'none',
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: isSelected ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'rgba(30, 41, 59, 0.8)',
                color: isSelected ? '#ffffff' : '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
              }}>
                {cat.svg}
              </div>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 2px', color: '#f8fafc' }}>{cat.name}</h3>
              <p style={{ margin: 0, fontSize: '10px', color: '#64748b' }}>{cat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* ফিল্টার করা প্রোডাক্ট তালিকা */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>
            {CATEGORIES.find((c) => c.id === selectedCat)?.name} ({filtered.length})
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: '12px' }}>লোড হচ্ছে...</div>
        ) : filtered.length === 0 ? (
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
            এই ক্যাটাগরিতে এখনো কোনো সার্ভিস যুক্ত করা হয়নি।
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {filtered.map((prod) => (
              <Link
                key={prod.id}
                href={`/product/${prod.id}`}
                style={{
                  textDecoration: 'none',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'inherit',
                }}
              >
                <div style={{ width: '100%', height: '115px', background: '#0b0f19' }}>
                  <img
                    src={prod.image || LOGO_HUB_CART}
                    alt={prod.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = LOGO_HUB_CART; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 8px', color: '#f8fafc', minHeight: '32px', lineHeight: 1.3 }}>{prod.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', fontWeight: '900', color: '#38bdf8' }}>৳{prod.price}</span>
                    <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>
                      Buy
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
