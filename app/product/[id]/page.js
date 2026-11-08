'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../context/LanguageContext';
import Icon from '../../../components/icons';
import { productImageSrc } from '../../../lib/productImage';

const LOGO_HUB_CART = '/logo-icon.png';
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
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [revAvg, setRevAvg] = useState(0);
  const [revCount, setRevCount] = useState(0);
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(0);
  const [revText, setRevText] = useState('');
  const [revBusy, setRevBusy] = useState(false);
  const [revDone, setRevDone] = useState(false);

  async function loadReviews(pid) {
    try {
      const r = await fetch(`/api/reviews?productId=${pid}`);
      const d = await r.json();
      if (Array.isArray(d.reviews)) { setReviews(d.reviews); setRevAvg(d.avg || 0); setRevCount(d.count || 0); }
    } catch {}
  }

  useEffect(() => { if (id) loadReviews(id); }, [id]);

  async function submitReview(e) {
    e.preventDefault();
    if (!revName.trim() || !revText.trim() || !revRating) { alert(t.rev.fillAll); return; }
    setRevBusy(true);
    try {
      const r = await fetch('/api/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: Number(id), name: revName.trim(), rating: revRating, text: revText.trim() }),
      });
      const d = await r.json();
      if (r.ok && d.ok) {
        setRevDone(true); setRevText('');
        await loadReviews(id);
      } else { alert(t.rev.failed); }
    } catch { alert(t.rev.failed); }
    finally { setRevBusy(false); }
  }


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

  // কার্টে যোগ করুন — hubcart_cart-এ আইটেম রাখে (checkout cart page থেকে)
  const handleAddToCart = () => {
    if (!product) return;
    try {
      const existing = JSON.parse(localStorage.getItem('hubcart_cart') || '[]');
      const found = existing.find((i) => i.id === product.id);
      let updated;
      if (found) {
        updated = existing.map((i) => i.id === product.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
      } else {
        updated = [...existing, {
          id: product.id, title: product.title, price: product.price,
          original_price: product.original_price,
          image: productImageSrc(product, ''), category: product.category, quantity: 1,
        }];
      }
      localStorage.setItem('hubcart_cart', JSON.stringify(updated));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e) { console.error(e); }
  };

  // এখনই কিনুন বাটনে ক্লিক করলে ডাটা সেভ করে নতুন পেজে নিয়ে যাবে
  const handleBuyNow = () => {
    if (!product) return;

    const selectedProduct = {
      id: product.id || `HC-${Date.now().toString().slice(-6)}`,
      title: product.title,
      price: product.price,
      original_price: product.original_price,
      image: productImageSrc(product, ''),
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
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '18px 16px 120px' }}>
      
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
            src={productImageSrc(product, LOGO_HUB_CART)}
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
            {product.original_price && Number(product.original_price) > Number(product.price) && (
              <span style={{ fontSize: '11px', fontWeight: '900', background: '#ef4444', color: '#ffffff', padding: '3px 8px', borderRadius: '999px', alignSelf: 'center' }}>-{Math.round((1 - Number(product.price) / Number(product.original_price)) * 100)}%</span>
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

      {/* কাস্টমার রিভিউ */}
      <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '20px', marginTop: '16px', marginBottom: '70px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#f8fafc', margin: '0 0 6px' }}><span style={{ display: "inline-flex", verticalAlign: "-2px", marginRight: "6px" }}><Icon name="star" size={15} color="#facc15" /></span>{t.rev.title}</h3>
        {revCount > 0 ? (
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 14px' }}>
            <span style={{ color: '#facc15', fontSize: '15px' }}>{'★'.repeat(Math.round(revAvg))}{'☆'.repeat(5 - Math.round(revAvg))}</span>{' '}
            <strong style={{ color: '#f8fafc' }}>{revAvg.toFixed(1)}/5</strong> · {t.rev.basedOn.replace('{count}', revCount)}
          </p>
        ) : (
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 14px' }}>{t.rev.noReviews}</p>
        )}

        {reviews.map((r, i) => (
          <div key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: '13px', color: '#f8fafc' }}>{r.name}</strong>
              <span style={{ color: '#facc15', fontSize: '13px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
            </div>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: '4px 0 0', whiteSpace: 'pre-line' }}>{r.text}</p>
          </div>
        ))}

        <form onSubmit={submitReview} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>{t.rev.writeYours}</h4>
          {revDone && <p style={{ fontSize: '13px', color: '#4ade80', margin: 0 }}>{t.rev.thanks}</p>}
          <input value={revName} onChange={(e) => setRevName(e.target.value)} placeholder={t.rev.namePlaceholder} maxLength={60}
            style={{ background: '#0b1220', border: '1px solid #26334d', borderRadius: '10px', padding: '10px 12px', color: '#f8fafc', fontSize: '13px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{t.rev.ratingLabel}:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRevRating(n)} aria-label={`${n} star`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', lineHeight: 1, padding: 0, color: n <= revRating ? '#facc15' : '#475569' }}>★</button>
            ))}
          </div>
          <textarea value={revText} onChange={(e) => setRevText(e.target.value)} placeholder={t.rev.textPlaceholder} rows={3} maxLength={600}
            style={{ background: '#0b1220', border: '1px solid #26334d', borderRadius: '10px', padding: '10px 12px', color: '#f8fafc', fontSize: '13px', resize: 'vertical' }} />
          <button type="submit" disabled={revBusy}
            style={{ background: 'linear-gradient(135deg, #a6f36a, #d2ffad)', color: '#10170c', border: 'none', padding: '11px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: revBusy ? 'not-allowed' : 'pointer' }}>
            {revBusy ? t.rev.submitting : t.rev.submit}
          </button>
        </form>
      </div>

      {/* নিচের ফিক্সড অর্ডার বার */}
      <div style={{
        position: 'fixed',
        bottom: '12px',
        left: '12px',
        right: '12px',
        maxWidth: '560px',
        margin: '0 auto',
        background: 'linear-gradient(180deg, rgba(20, 28, 44, 0.78), rgba(10, 14, 22, 0.72))',
        backdropFilter: 'blur(22px) saturate(180%)',
        WebkitBackdropFilter: 'blur(22px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.13)',
        borderRadius: '22px',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.13), 0 18px 42px rgba(0, 0, 0, 0.5)',
        padding: '10px',
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
          onClick={handleAddToCart}
          style={{
            flex: 1, border: '1.5px solid rgba(166, 243, 106, 0.55)',
            background: added ? 'rgba(166, 243, 106, 0.22)' : 'rgba(166, 243, 106, 0.08)',
            color: '#a6f36a', padding: '12px 8px', borderRadius: '14px',
            fontWeight: 'bold', fontSize: '13px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
        >
          <span>{added ? t.prod.addedToCart : t.prod.addToCart}</span>
        </button>

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
          <Icon name="bolt" size={16} color="#10170c" />
          <span>{t.prod.buyNow}</span>
        </button>
      </div>

    </div>
  );
}
