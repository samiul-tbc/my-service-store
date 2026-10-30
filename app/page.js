'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';
const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

const CATEGORIES = [
  { id: 'all', name: 'All Services', icon: '⚡' },
  { id: 'android-root', name: 'Android Root', icon: '⚡' },
  { id: 'android-panel', name: 'Android Panel', icon: '📱' },
  { id: 'social-package', name: 'Social Package', icon: '🚀' },
  { id: 'subscriptions', name: 'Subscriptions', icon: '💎' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000); // ৭ সেকেন্ডের বেশি আটকে থাকলে অটো রিলিজ

    async function loadProducts() {
      try {
        setLoadingProducts(true);
        setHasError(false);

        const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id,title,price,original_price,category,image&order=id.desc`, {
          signal: controller.signal,
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });

        if (!res.ok) throw new Error('ডাটাবেজ কানেকশন সমস্যা');

        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Fetch error:', err);
          setHasError(true);
        }
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) {
          setLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  const filteredProducts = products.filter((prod) =>
    selectedCategory === 'all' ? true : prod.category === selectedCategory
  );

  return (
    <main style={{ maxWidth: '650px', margin: '0 auto' }}>
      {/* ব্যানার */}
      <section style={{ margin: '12px 14px', background: 'radial-gradient(circle at center, #1e3a8a 0%, #030712 100%)', borderRadius: '16px', padding: '22px 16px', textAlign: 'center', color: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
          <img src={LOGO_HUB_CART} alt="Logo" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
          <h2 style={{ fontSize: '22px', fontWeight: '900', margin: 0, letterSpacing: '0.5px' }}>Hub Cart</h2>
        </div>
        <p style={{ margin: 0, fontSize: '11px', color: '#93c5fd', letterSpacing: '1px', fontWeight: 'bold' }}>SHOP SMART • LIVE BETTER</p>
      </section>

      {/* ক্যাটাগরি বার */}
      <section style={{ padding: '0 14px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>Categories</h3>
          <Link href="/categories" style={{ textDecoration: 'none', fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>সব দেখুন →</Link>
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                minWidth: '95px',
                background: selectedCategory === cat.id ? '#2563eb' : '#ffffff',
                color: selectedCategory === cat.id ? '#ffffff' : '#475569',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '10px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: '18px' }}>{cat.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>{cat.name}</div>
            </button>
          ))}
        </div>
      </section>

      {/* প্রোডাক্ট গ্রিড */}
      <section style={{ padding: '0 14px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 12px', color: '#0f172a' }}>All Products</h3>

        {loadingProducts ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
            প্রোডাক্ট লোড হচ্ছে...
          </div>
        ) : hasError ? (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '24px 16px', textAlign: 'center', color: '#dc2626' }}>
            <p style={{ margin: '0 0 10px', fontSize: '13px' }}>ডাটা লোড করতে সমস্যা হয়েছে।</p>
            <button
              onClick={() => window.location.reload()}
              style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '30px 16px', textAlign: 'center', color: '#64748b' }}>
            এই ক্যাটাগরিতে কোনো প্রোডাক্ট নেই।
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {filteredProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/product/${prod.id}`}
                style={{
                  textDecoration: 'none',
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  color: 'inherit'
                }}
              >
                <div style={{ width: '100%', height: '125px', background: '#f8fafc', overflow: 'hidden' }}>
                  <img 
                    src={prod.image || LOGO_HUB_CART} 
                    alt={prod.title || 'Product'} 
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.src !== LOGO_HUB_CART) {
                        e.currentTarget.src = LOGO_HUB_CART;
                      }
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 8px', color: '#1e293b', minHeight: '30px', lineHeight: 1.3 }}>
                    {prod.title}
                  </h4>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#dc2626' }}>৳{prod.price}</span>
                      {prod.original_price && (
                        <span style={{ fontSize: '10px', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '4px' }}>
                          ৳{prod.original_price}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        padding: '5px 9px',
                        borderRadius: '6px',
                        background: '#2563eb',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}
                    >
                      Buy Now
                    </span>
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
