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
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
        প্রোডাক্ট বিবরণ লোড হচ্ছে...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3 style={{ color: '#0f172a' }}>প্রোডাক্টটি পাওয়া যায়নি!</h3>
        <Link href="/" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>
          ← হোমপেজে ফিরে যান
        </Link>
      </div>
    );
  }

  // সরাসরি WhatsApp-এ অর্ডার মেসেজ লিংক
  const whatsappMsg = encodeURIComponent(`হ্যালো, আমি Hub Cart থেকে এই সার্ভিসটি নিতে চাই:\n\nপ্রোডাক্ট: ${product.title}\nমূল্য: ৳${product.price}\nলিংক: ${typeof window !== 'undefined' ? window.location.href : ''}`);
  const whatsappUrl = `https://wa.me/8801700000000?text=${whatsappMsg}`; // আপনার WhatsApp নম্বর দিন

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '16px 16px 90px', background: '#f8fafc' }}>
      
      {/* ব্যাক বাটন */}
      <button
        onClick={() => router.back()}
        style={{ border: 'none', background: 'none', color: '#475569', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', padding: '6px 0', marginBottom: '10px' }}
      >
        ← পেছনে যান
      </button>

      {/* প্রোডাক্ট কার্ড */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        {/* ছবি */}
        <div style={{ width: '100%', height: '260px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={product.image || LOGO_HUB_CART}
            alt={product.title}
            onError={(e) => { e.currentTarget.src = LOGO_HUB_CART; }}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* তথ্য ও বিবরণ */}
        <div style={{ padding: '18px' }}>
          <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
            {product.category || 'Service'}
          </span>

          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0 8px', color: '#0f172a' }}>
            {product.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#dc2626' }}>৳{product.price}</span>
            {product.original_price && (
              <span style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'line-through' }}>
                ৳{product.original_price}
              </span>
            )}
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 6px', color: '#334155' }}>বিস্তারিত বিবরণ:</h4>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-line', margin: 0 }}>
              {product.description || 'এই প্রোডাক্টটির জন্য কোনো অতিরিক্ত বিবরণ দেওয়া হয়নি।'}
            </p>
          </div>
        </div>
      </div>

      {/* নিচের ফিক্সড অর্ডার বার */}
      <div style={{ position: 'fixed', bottom: 62, left: 0, right: 0, background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '10px 16px', display: 'flex', gap: '10px', zIndex: 90, maxWidth: '600px', margin: '0 auto' }}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ flex: 1, textDecoration: 'none', background: '#22c55e', color: '#ffffff', textAlign: 'center', padding: '12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px' }}
        >
          💬 WhatsApp অর্ডার
        </a>
        <button
          onClick={() => alert('অর্ডার প্রক্রিয়া চালু হয়েছে!')}
          style={{ flex: 1, border: 'none', background: '#2563eb', color: '#ffffff', padding: '12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
        >
          ⚡ এখনই কিনুন
        </button>
      </div>

    </div>
  );
}
