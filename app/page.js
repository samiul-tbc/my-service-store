'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';
const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

// প্রিমিয়াম ভেক্টর SVG আইকন সম্বলিত ক্যাটাগরি তালিকা
const CATEGORIES = [
  {
    id: 'all',
    name: 'All Services',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
  },
  {
    id: 'android-panel',
    name: 'Android Panel',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </svg>
    ),
  },
  {
    id: 'social-package',
    name: 'Social Boost',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
      </svg>
    ),
  },
  {
    id: 'subscriptions',
    name: 'VIP Subs',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
      </svg>
    ),
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/products?select=id,title,price,original_price,category,image&order=id.desc`,
          {
            cache: 'no-store',
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }
        );
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = products.filter((prod) =>
    selectedCategory === 'all' ? true : prod.category === selectedCategory
  );

  return (
    <main style={{ maxWidth: '640px', margin: '0 auto', paddingBottom: '90px' }}>
      
      {/* ১. হিরো ব্যানার (Cyber-Glass Gradient Glow) */}
      <section style={{
        margin: '12px 14px 20px',
        padding: '24px 18px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        boxShadow: '0 12px 30px -10px rgba(37, 99, 235, 0.35)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        {/* ব্যাকগ্রাউন্ড অরা লাইটিং */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '180px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.45) 0%, transparent 70%)',
          filter: 'blur(20px)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(96, 165, 250, 0.3)', padding: '4px 12px', borderRadius: '30px', marginBottom: '14px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }}></span>
          <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#93c5fd', letterSpacing: '1px' }}>INSTANT DELIVERY • 24/7 SUPPORT</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
          <img
            src={LOGO_HUB_CART}
            alt="Hub Cart"
            style={{ width: '42px', height: '42px', objectFit: 'contain', filter: 'drop-shadow(0 4px 10px rgba(59, 130, 246, 0.5))' }}
          />
          <h1 style={{ fontSize: '26px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Hub Cart
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
          Next-Gen Digital Tools & Premium Services
        </p>
      </section>

      {/* ২. ক্যাটাগরি পিলস (Horizontal Glass Selector) */}
      <section style={{ padding: '0 14px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Explore Services
          </span>
          <Link href="/categories" style={{ textDecoration: 'none', fontSize: '11px', color: '#38bdf8', fontWeight: '600' }}>
            View All →
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  borderRadius: '14px',
                  background: isSelected ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'rgba(30, 41, 59, 0.6)',
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  border: isSelected ? '1px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 14px rgba(37, 99, 235, 0.4)' : 'none',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{cat.svg}</span>
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* ৩. প্রোডাক্ট গ্রিড (Ultra-Glass Card) */}
      <section style={{ padding: '0 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0, color: '#f1f5f9' }}>
            {selectedCategory === 'all' ? 'Featured Packages' : 'Category Results'}
          </h2>
          <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
            {filteredProducts.length}
          </span>
        </div>

        {loadingProducts ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#64748b' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid rgba(59, 130, 246, 0.2)', borderTopColor: '#3b82f6', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: '12px', letterSpacing: '0.5px' }}>Loading Services...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '18px', padding: '40px 16px', textAlign: 'center', color: '#64748b' }}>
            <p style={{ margin: 0, fontSize: '13px' }}>এই ক্যাটাগরিতে কোনো প্যাকেজ পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {filteredProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/product/${prod.id}`}
                style={{
                  textDecoration: 'none',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  color: 'inherit'
                }}
              >
                {/* ইমেজ কন্টেইনার */}
                <div style={{ width: '100%', height: '125px', background: '#0b0f19', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={prod.image || LOGO_HUB_CART}
                    alt={prod.title || 'Product'}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = LOGO_HUB_CART; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {prod.original_price && (
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      fontSize: '9px',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      backdropFilter: 'blur(4px)'
                    }}>
                      SALE
                    </span>
                  )}
                </div>

                {/* কন্টেন্ট বক্স */}
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {prod.category || 'Service'}
                    </span>
                    <h3 style={{ fontSize: '13px', fontWeight: '600', margin: '4px 0 10px', color: '#f8fafc', lineHeight: 1.35, minHeight: '34px' }}>
                      {prod.title}
                    </h3>
                  </div>

                  {/* মূল্য ও বাটন */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '900', color: '#38bdf8' }}>
                        ৳{prod.price}
                      </div>
                      {prod.original_price && (
                        <span style={{ fontSize: '10px', color: '#64748b', textDecoration: 'line-through' }}>
                          ৳{prod.original_price}
                        </span>
                      )}
                    </div>

                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
                    }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
