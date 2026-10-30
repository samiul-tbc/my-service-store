'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/4Y3TK6bN/5707.png';
const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';
const WHATSAPP_NUMBER = '8801893432478'; // এখানে আপনার WhatsApp নম্বর দিন

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // "এখনই কিনুন" হ্যান্ডলার: প্রোডাক্ট কার্টে যোগ করে সরাসরি /cart পেজে নিয়ে যাবে
  const handleBuyNow = () => {
    if (!product) return;

    try {
      const existingCart = JSON.parse(localStorage.getItem('hubcart_cart') || '[]');
      const itemIndex = existingCart.findIndex((item) => item.id === product.id);

      if (itemIndex > -1) {
        existingCart[itemIndex].quantity = (existingCart[itemIndex].quantity || 1) + 1;
      } else {
        existingCart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: 1,
        });
      }

      localStorage.setItem('hubcart_cart', JSON.stringify(existingCart));
      router.push('/cart');
    } catch (e) {
      console.error(e);
      router.push('/cart');
    }
  };

  if (loading) {
    return <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b' }}>প্যাকেজ বিবরণ লোড হচ্ছে...</div>;
  }

  if (!product) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94a3b8' }}>
        <h3>প্রোডাক্টটি পাওয়া যায়নি!</h3>
        <Link href="/" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>← ফিরে যান</Link>
      </div>
    );
  }

  const whatsappMsg = encodeURIComponent(`হ্যালো, আমি Hub Cart থেকে সার্ভিস নিতে চাই:\nসার্ভিস: ${product.title}\nমূল্য: ৳${product.price}`);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '14px 14px 100px' }}>
      
      {/* ব্যাক বাটন */}
      <button
        onClick={() => router.back()}
        style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', padding: '4px 0', marginBottom: '12px' }}
      >
        ← পেছনে যান
      </button>

      {/* প্রোডাক্ট বিবরণ কার্ড */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}>
        <div style={{ width: '100%', height: '240px', background: '#0b0f19', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={product.image || LOGO_HUB_CART}
            alt={product.title}
            onError={(e) => { e.currentTarget.src = LOGO_HUB_CART; }}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        <div style={{ padding: '20px' }}>
          <span style={{ fontSize: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {product.category || 'Service'}
          </span>

          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '12px 0 8px', color: '#f8fafc' }}>
            {product.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '18px' }}>
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#38bdf8' }}>৳{product.price}</span>
            {product.original_price && (
              <span style={{ fontSize: '13px', color: '#64748b', textDecoration: 'line-through' }}>৳{product.original_price}</span>
            )}
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 6px', color: '#94a3b8', textTransform: 'uppercase' }}>বিস্তারিত বিবরণ:</h4>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-line', margin: 0 }}>
              {product.description || 'এই প্যাকেজের জন্য কোনো অতিরিক্ত বিবরণ দেওয়া হয়নি।'}
            </p>
          </div>
        </div>
      </div>

      {/* নিচের ফিক্সড অর্ডার বার */}
      <div style={{
        position: 'fixed',
        bottom: 60,
        left: 0,
        right: 0,
        background: 'rgba(11, 15, 25, 0.92)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '10px 16px',
        display: 'flex',
        gap: '10px',
        zIndex: 90,
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            textDecoration: 'none',
            background: '#16a34a',
            color: '#ffffff',
            textAlign: 'center',
            padding: '12px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span>💬</span> WhatsApp অর্ডার
        </a>

        <button
          onClick={handleBuyNow}
          style={{
            flex: 1,
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
          }}
        >
          <span>⚡</span> এখনই কিনুন
        </button>
      </div>

    </div>
  );
}
