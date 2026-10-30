'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';
const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // ১. প্রোডাক্ট ফেচ
        const prodRes = await fetch(
          `${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`,
          {
            cache: 'no-store',
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }
        );
        const prodData = await prodRes.json();
        if (Array.isArray(prodData)) setProducts(prodData);

        // ২. ডায়নামিক নোটিশ ফেচ
        const noticeRes = await fetch(
          `${SUPABASE_URL}/rest/v1/site_settings?key=eq.announcement&select=value`,
          {
            cache: 'no-store',
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }
        );
        const noticeData = await noticeRes.json();
        if (Array.isArray(noticeData) && noticeData.length > 0) {
          setNotice(noticeData[0].value);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '12px 14px 100px' }}>
      
      {/* ডায়নামিক নোটিশ ব্যানার */}
      {notice && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          padding: '10px 14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(56, 189, 248, 0.1)',
        }}>
          <span style={{
            fontSize: '14px',
            background: 'rgba(56, 189, 248, 0.2)',
            padding: '4px 6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            📢
          </span>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
            <span style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#f8fafc',
              letterSpacing: '0.2px',
            }}>
              {notice}
            </span>
          </div>
        </div>
      )}

      {/* আগের Hub Cart ব্যানার */}
      <div style={{
        background: 'radial-gradient(circle at center, #0a2356 0%, #020816 85%)',
        borderRadius: '24px',
        padding: '30px 16px',
        border: '1px solid rgba(56, 189, 248, 0.15)',
        marginBottom: '22px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
          <img
            src={LOGO_HUB_CART}
            alt="Hub Cart Logo"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '8px',
              objectFit: 'contain',
              background: '#000000',
              padding: '3px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          />
          <h1 style={{
            fontSize: '28px',
            fontWeight: '900',
            color: '#ffffff',
            margin: 0,
            letterSpacing: '0.5px',
          }}>
            Hub Cart
          </h1>
        </div>
        <p style={{
          margin: 0,
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '2.8px',
          color: '#82a5dc',
          textTransform: 'uppercase',
        }}>
          SHOP SMART &bull; LIVE BETTER
        </p>
      </div>

      {/* প্রোডাক্ট তালিকা */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '900', margin: 0, color: '#f8fafc' }}>
            জনপ্রিয় সার্ভিসসমূহ
          </h2>
          <Link href="/categories" style={{ fontSize: '11px', color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>
            সব দেখুন ↗
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#64748b', fontSize: '12px' }}>
            সার্ভিস লোড হচ্ছে...
          </div>
        ) : products.length === 0 ? (
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '16px', padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
            কোনো প্রোডাক্ট পাওয়া যায়নি।
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {products.map((prod) => (
              <Link
                key={prod.id}
                href={`/product/${prod.id}`}
                style={{
                  textDecoration: 'none',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'inherit',
                  transition: 'transform 0.15s ease',
                }}
              >
                <div style={{ width: '100%', height: '120px', background: '#0b0f19' }}>
                  <img
                    src={prod.image || LOGO_HUB_CART}
                    alt={prod.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = LOGO_HUB_CART; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 8px', color: '#f8fafc', minHeight: '32px', lineHeight: 1.3 }}>
                    {prod.title}
                  </h3>
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
