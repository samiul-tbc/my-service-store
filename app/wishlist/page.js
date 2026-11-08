'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import Icon from '../../components/icons';
import WishHeart from '../../components/WishHeart';
import { productImageSrc } from '../../lib/productImage';
import { getWishlist } from '../../lib/shop';

const LOGO_HUB_CART = '/logo-icon.png';

export default function WishlistPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const ids = getWishlist();
    if (!ids.length) { setItems([]); setLoading(false); return; }
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data.products)) {
        setItems(data.products.filter((p) => ids.includes(Number(p.id))));
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 16px 100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#f8fafc', margin: '0 0 4px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="heart" size={21} color="#f87171" /> {t.shop.wishlist}
        </h1>
        {items.length > 0 && <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{t.cat.countLabel.replace('{count}', items.length)}</p>}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: '13px' }}>{t.cat.loading}</div>
      ) : items.length === 0 ? (
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(255, 255, 255, 0.12)', borderRadius: '18px', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}><Icon name="heart" size={38} color="#475569" /></div>
          <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: '0 0 5px' }}>{t.shop.wishlistEmpty}</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 18px' }}>{t.shop.wishlistEmptySub}</p>
          <Link href="/categories" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #a6f36a, #d2ffad)', color: '#10170c', padding: '11px 22px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
            {t.cart.browse}
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '14px' }}>
          {items.map((prod) => (
            <Link key={prod.id} href={`/product/${prod.id}`} style={{ textDecoration: 'none', background: 'rgba(15, 23, 42, 0.75)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column', color: 'inherit' }}>
              <div style={{ width: '100%', height: '150px', background: '#0b0f19', position: 'relative' }}>
                <WishHeart productId={prod.id} onToggle={() => load()} />
                {prod.original_price && Number(prod.original_price) > Number(prod.price) && (
                  <span style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2, fontSize: '10px', fontWeight: '900', background: '#ef4444', color: '#ffffff', padding: '3px 7px', borderRadius: '999px' }}>-{Math.round((1 - Number(prod.price) / Number(prod.original_price)) * 100)}%</span>
                )}
                <img src={productImageSrc(prod, LOGO_HUB_CART)} alt={prod.title} loading="lazy" onError={(e) => { e.currentTarget.src = LOGO_HUB_CART; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 8px', color: '#f8fafc', minHeight: '32px', lineHeight: 1.3 }}>{prod.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: '900', color: '#a6f36a' }}>৳{prod.price}</span>
                  <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'linear-gradient(135deg, #a6f36a, #d2ffad)', color: '#10170c', fontSize: '10px', fontWeight: 'bold' }}>{t.cat.buy}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
