'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';
const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}&select=*`, {
          cache: 'no-store',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#94a3b8' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid rgba(56, 189, 248, 0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
        বিবরণ লোড হচ্ছে...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#f8fafc' }}>
        <h3>প্রোডাক্টটি পাওয়া যায়নি!</h3>
        <Link href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>
          ← হোমপেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const whatsappMsg = encodeURIComponent(`হ্যালো Hub Cart! আমি এই সার্ভিসটি নিতে আগ্রহী:\n\nপ্যাকেজ: ${product.title}\nমূল্য: ৳${product.price}\nপেজ: ${typeof window !== 'undefined' ? window.location.href : ''}`);
  const whatsappUrl = `https://wa.me/8801700000000?text=${whatsappMsg}`; // আপনার WhatsApp নম্বর

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '12px 14px 100px', color: '#f8fafc' }}>
      
      {/* ব্যাক বাটন */}
      <button
        onClick={() => router.back()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#94a3b8',
          padding: '8px 14px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '14px'
        }}
      >
        ← পেছনে যান
      </button>

      {/* মেইন প্রোডাক্ট কার্ড */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(0,0,0,0.3)'
      }}>
        {/* ছবি বক্স */}
        <div style={{ width: '100%', height: '260px', background: '#070a13', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <img
            src={product.image || LOGO_HUB_CART}
            alt={product.title}
            onError={(e) => { e.currentTarget.src = LOGO_HUB_CART; }}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* বিস্তারিত বিবরণ */}
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px' }}>
            {product.category || 'VIP Service'}
          </div>

          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 12px', color: '#f8fafc', lineHeight: 1.4 }}>
            {product.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
            <span style={{ fontSize: '26px', fontWeight: '900', color: '#38bdf8' }}>৳{product.price}</span>
            {product.original_price && (
              <span style={{ fontSize: '14px', color: '#64748b', textDecoration: 'line-through' }}>
                ৳{product.original_price}
              </span>
            )}
          </div>

          <h4 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 8px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            সার্ভিস বিবরণ:
          </h4>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7', whiteSpace: 'pre-line', margin: 0 }}>
            {product.description || 'এই সার্ভিসের জন্য অতিরিক্ত কোনো বিবরণ দেওয়া হয়নি। সরাসরি অর্ডারের জন্য WhatsApp-এ মেসেজ দিন।'}
          </p>
        </div>
      </div>

      {/* নিচের অ্যাকশন বার */}
      <div style={{
        position: 'fixed',
        bottom: '60px',
        left: 0,
        right: 0,
        background: 'rgba(11, 15, 25, 0.9)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '10px 16px',
        display: 'flex',
        gap: '12px',
        zIndex: 90,
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: '#ffffff',
            textAlign: 'center',
            padding: '12px',
            borderRadius: '14px',
            fontWeight: 'bold',
            fontSize: '13px',
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)'
          }}
        >
          WhatsApp অর্ডার
        </a>

        <button
          onClick={() => alert('সরাসরি অর্ডার সার্ভিস চালু হচ্ছে...')}
          style={{
            flex: 1,
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '14px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
          }}
        >
          এখনই কিনুন ⚡
        </button>
      </div>

    </div>
  );
}
