'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../context/LanguageContext';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';
const LOGO_WHATSAPP = 'https://download.logo.wine/logo/WhatsApp/WhatsApp-Logo.wine.png';

// Vercel Environment Variables থেকে ডাটা নেওয়া হচ্ছে
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';
const WHATSAPP_NUMBER = '8801319760720';

export default function ProductDetailPage() {
  const { t } = useLanguage();
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

  // এখনই কিনুন বাটনে ক্লিক করলে ডাটা সেভ করে নতুন পেজে নিয়ে যাবে
  const handleBuyNow = () => {
    if (!product) return;

    const selectedProduct = {
      id: product.id || `HC-${Date.now().toString().slice(-6)}`,
      title: product.title,
      price: product.price,
      original_price: product.original_price,
      image: product.image,
      category: product.category,
    };

    localStorage.setItem('hubcart_selected_product', JSON.stringify(selectedProduct));
    router.push('/confirm-order');
  };

  if (loading) {
    return <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b' }}>{t.prod.loading}</div>;
  }

  if (!product) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94a3b8' }}>
        <h3>{t.prod.notFound}</h3>
        <Link href="/" style={{ color: '#a6f36a', textDecoration: 'none', fontWeight: 'bold' }}>{t.prod.goBack}</Link>
      </div>
    );
  }

  const whatsappMsg = encodeURIComponent(
    t.prod.waMsg
      .replace('{title}', product.title)
      .replace('{price}', product.price)
      .replace('{link}', typeof window !== 'undefined' ? window.location.href : '')
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`;

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '18px 16px 40px' }}>
      
      {/* ব্যাক বাটন */}
      <button
        onClick={() => router.back()}
        style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', padding: '4px 0', marginBottom: '12px' }}
      >
        {t.prod.back}
      </button>

      {/* প্রোডাক্ট কার্ড */}
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
          <span style={{ fontSize: '10px', background: 'rgba(166, 243, 106, 0.15)', color: '#a6f36a', padding: '4px 10px', borderRadius: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {product.category || t.prod.service}
          </span>

          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '12px 0 8px', color: '#f8fafc' }}>
            {product.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '18px' }}>
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#a6f36a' }}>৳{product.price}</span>
            {product.original_price && (
              <span style={{ fontSize: '13px', color: '#64748b', textDecoration: 'line-through' }}>৳{product.original_price}</span>
            )}
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 6px', color: '#94a3b8', textTransform: 'uppercase' }}>{t.prod.details}</h4>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-line', margin: 0 }}>
              {product.description || t.prod.noDesc}
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
        background: 'rgba(11, 15, 25, 0.94)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '10px 14px',
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
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1.5px solid rgba(34, 197, 94, 0.5)',
            color: '#4ade80',
            textAlign: 'center',
            padding: '12px 8px',
            borderRadius: '14px',
            fontWeight: 'bold',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
          }}
        >
          <img
            src={LOGO_WHATSAPP}
            alt="WhatsApp"
            style={{ width: '22px', height: '22px', objectFit: 'contain' }}
          />
          <span>{t.prod.whatsappOrder}</span>
        </a>

        <button
          onClick={handleBuyNow}
          style={{
            flex: 1,
            border: 'none',
            background: 'linear-gradient(135deg, #a6f36a, #d2ffad)',
            color: '#10170c',
            padding: '12px 8px',
            borderRadius: '14px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(166, 243, 106, 0.4)',
          }}
        >
          <span>⚡</span>
          <span>{t.prod.buyNow}</span>
        </button>
      </div>

    </div>
  );
}
