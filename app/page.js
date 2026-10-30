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

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`, {
          cache: 'no-store',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter((prod) =>
    selectedCategory === 'all' ? true : prod.category === selectedCategory
  );

  return (
    <main>
      {/* ব্যানার */}
      <section style={{ margin: '12px 14px', background: 'radial-gradient(circle at center, #1e3a8a 0%, #030712 100%)', borderRadius: '16px', padding: '24px 16px', textAlign: 'center', color: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '4px' }}>
          <img src={LOGO_HUB_CART} alt="Logo" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>Hub Cart</h2>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#93c5fd', letterSpacing: '1px' }}>SHOP SMART • LIVE BETTER</p>
      </section>

      {/* ক্যাটাগরি স্লাইডার */}
      <section style={{ padding: '0 14px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>Categories</h3>
          <Link href="/categories" style={{ textDecoration: 'none', fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>সব দেখুন →</Link>
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                minWidth: '100px',
                background: selectedCategory === cat.id ? '#2563eb' : '#fff',
                color: selectedCategory === cat.id ? '#fff' : '#475569',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '10px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: '20px' }}>{cat.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '4px' }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* প্রোডাক্ট গ্রিড (ক্লিক করলে /product/[id] পেজে যাবে) */}
      <section style={{ padding: '0 14px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 12px' }}>All Products</h3>

        {loadingProducts ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>প্রোডাক্ট লোড হচ্ছে...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '30px 16px', textAlign: 'center', color: '#64748b' }}>
            এই ক্যাটাগরিতে এখনো কোনো প্রোডাক্ট নেই।
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
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                  color: 'inherit'
                }}
              >
                <img 
                  src={prod.image || LOGO_HUB_CART} 
                  alt={prod.title} 
                  onError={(e) => { e.target.src = LOGO_HUB_CART; }}
                  style={{ width: '100%', height: '130px', objectFit: 'cover' }} 
                />
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 8px', color: '#1e293b', minHeight: '32px', lineHeight: 1.3 }}>{prod.title}</h4>
                  
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
                        padding: '5px 10px',
                        borderRadius: '6px',
                        background: '#2563eb',
                        color: '#fff',
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
