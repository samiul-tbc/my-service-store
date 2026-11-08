'use client';

// ============================================================
// Hub Cart — Home Page UI (Single-file version)
// ------------------------------------------------------------
// This is the EXACT UI of app/page.js from your uploaded project,
// but self-contained: all the `hc-` styles that were originally in
// app/globals.css are included inside this one file.
//
// How to use:
// 1. Replace your project's  app/page.js  with this file.
// 2. That's it — you do NOT need to change globals.css, Navbar
//    or BottomNav for this page's UI to look the same.
// 3. Products still load from your existing  /api/products  API
//    (same as the original). Notice text also comes from the API.
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import Icon from '../components/icons';
import { productImageSrc } from '../lib/productImage';
import WishHeart from '../components/WishHeart';
import { getRecent } from '../lib/shop';

const LOGO_HUB_CART = '/logo-icon.png';

export default function HomePage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [flashSale, setFlashSale] = useState(null);
  const [flashLeft, setFlashLeft] = useState('');
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadHomeData() {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        if (!active) return;
        if (Array.isArray(data.products)) setProducts(data.products);
        if (data.notice) setNotice(data.notice);
        if (data.flashSale && data.flashSale.active && data.flashSale.endTime) setFlashSale(data.flashSale);
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadHomeData();
    setRecent(getRecent());
    return () => { active = false; };
  }, []);

  // Flash sale countdown
  useEffect(() => {
    if (!flashSale) return;
    const target = new Date(flashSale.endTime).getTime();
    const fmt = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setFlashSale(null); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const sec = Math.floor((diff % 60000) / 1000);
      setFlashLeft(`${d > 0 ? d + 'd ' : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`);
    };
    fmt();
    const iv = setInterval(fmt, 1000);
    return () => clearInterval(iv);
  }, [flashSale]);

  return (
    <main className="hc-shell">
      {/* ---------- All styles for this page (originally in globals.css) ---------- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        :root{
          --hc-bg:#080b10;
          --hc-panel:#10151d;
          --hc-panel2:#141b24;
          --hc-line:rgba(255,255,255,.085);
          --hc-text:#f5f7fa;
          --hc-muted:#8d98a8;
          --hc-accent:#a6f36a;
          --hc-accent2:#d2ffad;
        }
        body{
          margin:0;
          background:var(--hc-bg);
          color:var(--hc-text);
          font-family:'DM Sans',system-ui,sans-serif;
          -webkit-font-smoothing:antialiased;
        }
        ::selection{ background:#a6f36a; color:#10150c; }

        .hc-shell{
          width:min(100% - 36px,1240px);
          margin:0 auto;
          padding:22px 0 112px;
        }
        @media(min-width:1024px){
          .hc-shell{ padding-bottom:40px; }
        }

        /* Notice bar */
        .hc-notice{
          display:flex; gap:11px; align-items:center;
          padding:12px 16px;
          border:1px solid rgba(166,243,106,.2);
          background:linear-gradient(90deg,rgba(166,243,106,.09),rgba(16,21,29,.85));
          border-radius:14px;
          color:#e7f7db; font-size:13px;
          margin-bottom:22px;
        }
        .hc-notice-mark{
          display:grid; place-items:center;
          width:28px; height:28px; border-radius:9px;
          background:rgba(166,243,106,.14);
          color:var(--hc-accent); flex:none;
        }

        /* Hero */
        .hc-hero{
          position:relative; overflow:hidden;
          min-height:340px;
          border:1px solid var(--hc-line);
          border-radius:28px;
          background:
            radial-gradient(ellipse at 78% 15%,rgba(166,243,106,.13),transparent 32%),
            linear-gradient(125deg,#151c25 0%,#0d1118 55%,#101b15 100%);
          padding:clamp(28px,5vw,62px);
          display:flex; align-items:center;
          margin-bottom:48px;
        }
        .hc-hero:after{
          content:''; position:absolute;
          width:400px; height:400px; right:-120px; top:-145px;
          border:1px solid rgba(166,243,106,.11); border-radius:50%;
          box-shadow:0 0 0 45px rgba(166,243,106,.025),0 0 0 90px rgba(166,243,106,.018);
          pointer-events:none;
        }
        .hc-hero-content{ position:relative; z-index:1; max-width:680px; }
        .hc-hero-visual{ position:relative; z-index:1; flex:none; width:330px; height:290px; margin-left:auto; }
        .hc-hero-card{ position:absolute; border-radius:20px; overflow:hidden; border:1px solid rgba(166,243,106,.28); box-shadow:0 24px 50px rgba(0,0,0,.45); background:#0d1118; }
        .hc-hero-card img{ width:100%; height:100%; object-fit:cover; display:block; }
        .hc-hero-card.main{ width:225px; height:225px; right:0; top:0; animation:hc-floaty 5s ease-in-out infinite; }
        .hc-hero-card.sub{ width:155px; height:155px; left:0; bottom:0; animation:hc-floaty 6s ease-in-out infinite reverse; }
        .hc-hero-card span{ position:absolute; left:10px; bottom:10px; background:#a6f36a; color:#10170c; font-size:12px; font-weight:900; padding:4px 10px; border-radius:999px; }
        @keyframes hc-floaty{ 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-9px) } }
        @media(max-width:900px){ .hc-hero-visual{ display:none } }
        .hc-eyebrow{
          display:inline-flex; align-items:center; gap:9px;
          color:var(--hc-accent);
          font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:800;
          margin-bottom:20px;
        }
        .hc-eyebrow:before{ content:''; height:1px; width:24px; background:var(--hc-accent); }
        .hc-hero h1{
          font-family:Manrope,sans-serif;
          font-size:clamp(36px,6vw,66px);
          line-height:1.04; letter-spacing:-2.5px;
          margin:0; max-width:700px; font-weight:800;
        }
        .hc-hero h1 em{ font-style:normal; color:var(--hc-accent); }
        .hc-hero p{
          color:#a7b1be; font-size:15px; line-height:1.8;
          max-width:510px; margin:20px 0 26px;
        }
        .hc-hero-actions{ display:flex; gap:12px; flex-wrap:wrap; }

        .hc-primary{
          display:inline-flex; align-items:center; justify-content:center; gap:9px;
          text-decoration:none;
          background:var(--hc-accent); color:#10170c;
          padding:13px 20px; border-radius:12px;
          font-size:13px; font-weight:800;
          box-shadow:0 8px 26px rgba(166,243,106,.12);
          transition:transform .2s,box-shadow .2s;
        }
        .hc-primary:hover{ transform:translateY(-2px); box-shadow:0 12px 30px rgba(166,243,106,.2); }

        .hc-secondary{
          display:inline-flex; align-items:center; justify-content:center;
          text-decoration:none;
          border:1px solid rgba(255,255,255,.15); color:#e7ebf0;
          padding:13px 18px; border-radius:12px;
          font-size:13px; font-weight:700;
          transition:border .2s,background .2s;
        }
        .hc-secondary:hover{ border-color:rgba(166,243,106,.45); background:rgba(166,243,106,.05); }

        /* Benefits */
        .hc-benefits{
          display:grid; grid-template-columns:repeat(3,1fr);
          gap:12px; margin:-24px 0 48px;
        }
        .hc-benefit{
          padding:17px 18px;
          border:1px solid var(--hc-line); border-radius:16px;
          background:#0e131a;
          display:flex; gap:12px; align-items:center;
        }
        .hc-benefit-icon{
          width:38px; height:38px; border-radius:12px;
          background:rgba(166,243,106,.09); color:var(--hc-accent);
          display:grid; place-items:center; font-size:17px; flex:none;
        }
        .hc-benefit strong{ display:block; font-size:13px; font-weight:800; }
        .hc-benefit small{ display:block; color:var(--hc-muted); font-size:11px; margin-top:4px; }

        /* Section head */
        .hc-section-head{
          display:flex; justify-content:space-between; align-items:end;
          gap:16px; margin-bottom:20px;
        }
        .hc-kicker{
          font-size:10px; letter-spacing:2px; text-transform:uppercase;
          color:var(--hc-accent); font-weight:800; margin-bottom:8px;
        }
        .hc-section-head h2{
          font-family:Manrope,sans-serif;
          font-size:clamp(23px,3vw,32px); letter-spacing:-1px;
          margin:0; font-weight:800;
        }
        .hc-section-head p{ color:var(--hc-muted); font-size:13px; margin:8px 0 0; }
        .hc-all-link{
          color:var(--hc-accent); text-decoration:none;
          font-size:12px; font-weight:800; white-space:nowrap;
        }

        /* Product grid + card */
        .hc-product-grid{
          display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px;
        }
        @media(min-width:901px){ .hc-pop-grid{ grid-template-columns:repeat(3,minmax(0,1fr)); } }
        .hc-product{
          position:relative; min-width:0; overflow:hidden;
          display:flex; flex-direction:column;
          text-decoration:none; color:inherit;
          border:1px solid var(--hc-line); border-radius:20px;
          background:linear-gradient(155deg,#141b24,#0d1118);
          transition:transform .22s,border-color .22s,box-shadow .22s;
        }
        .hc-product:hover{
          transform:translateY(-5px);
          border-color:rgba(166,243,106,.35);
          box-shadow:0 18px 40px rgba(0,0,0,.24);
        }
        .hc-product-media{
          height:clamp(150px,18vw,210px);
          position:relative; background:#0b1016; overflow:hidden;
        }
        .hc-product-media img{
          width:100%; height:100%; object-fit:cover; transition:transform .4s;
        }
        .hc-product:hover .hc-product-media img{ transform:scale(1.045); }
        .hc-product-media:after{
          content:''; position:absolute; inset:45% 0 0;
          background:linear-gradient(transparent,rgba(7,10,14,.5));
          pointer-events:none;
        }
        .hc-product-body{ padding:16px; display:flex; flex-direction:column; flex:1; }
        .hc-product-title{
          font-size:14px; font-weight:800; line-height:1.45;
          margin:0 0 10px; min-height:40px;
        }
        .hc-product-meta{ color:var(--hc-muted); font-size:11px; margin-bottom:14px; }
        .hc-product-bottom{
          display:flex; align-items:center; justify-content:space-between;
          gap:10px; margin-top:auto;
        }
        .hc-old-price{ font-size:12px; color:#64748b; text-decoration:line-through; margin-left:7px; font-weight:600; }
        .hc-off-badge{ position:absolute; top:10px; left:10px; z-index:2; background:#ef4444; color:#fff; font-size:11px; font-weight:800; padding:3px 8px; border-radius:999px; box-shadow:0 4px 10px rgba(239,68,68,.4); }
        .hc-price{
          font-family:Manrope,sans-serif;
          font-size:19px; font-weight:800; color:var(--hc-accent); letter-spacing:-.5px;
        }
        .hc-buy{
          height:34px; width:38px; border-radius:11px;
          background:var(--hc-accent); color:#11180c;
          display:grid; place-items:center; font-size:19px; font-weight:700;
        }

        /* Loading skeleton */
        .hc-skeleton{
          height:290px; border-radius:20px;
          background:linear-gradient(100deg,#111720 20%,#1a222d 40%,#111720 60%);
          background-size:200% 100%;
          animation:hc-shimmer 1.5s infinite;
        }
        @keyframes hc-shimmer{ to{ background-position:-200% 0; } }

        /* Empty state */
        .hc-empty{
          padding:44px 20px; text-align:center;
          border:1px dashed var(--hc-line); border-radius:18px;
          color:var(--hc-muted); background:rgba(255,255,255,.015);
        }

        /* Footer note */
        .hc-footer-note{
          margin-top:48px; padding:24px;
          border:1px solid var(--hc-line); border-radius:20px;
          background:linear-gradient(120deg,rgba(166,243,106,.055),transparent);
          display:flex; justify-content:space-between; align-items:center; gap:18px;
        }
        .hc-footer-note strong{ font-family:Manrope,sans-serif; font-size:18px; }
        .hc-footer-note p{ font-size:12px; color:var(--hc-muted); margin:7px 0 0; line-height:1.6; }

        /* Responsive */
        @media(max-width:900px){
          .hc-product-grid{ grid-template-columns:repeat(3,minmax(0,1fr)); }
          .hc-shell{ width:min(100% - 28px,1240px); }
        }
        @media(max-width:640px){
          .hc-shell{ width:calc(100% - 24px); padding-top:14px; }
          .hc-hero{ min-height:330px; border-radius:22px; padding:28px 22px; margin-bottom:38px; }
          .hc-hero h1{ letter-spacing:-1.6px; }
          .hc-hero p{ font-size:13px; }
          .hc-benefits{ grid-template-columns:1fr; gap:9px; margin-top:-18px; margin-bottom:38px; }
          .hc-benefit{ padding:13px; }
          .hc-product-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); gap:11px; }
          .hc-product{ border-radius:16px; }
          .hc-product-media{ height:140px; }
          .hc-product-body{ padding:12px; }
          .hc-product-title{ font-size:12px; min-height:36px; }
          .hc-price{ font-size:16px; }
          .hc-buy{ width:32px; height:30px; border-radius:9px; }
          .hc-section-head{ align-items:center; }
          .hc-section-head p{ font-size:11px; }
          .hc-footer-note{ padding:18px; display:block; }
          .hc-footer-note .hc-primary{ margin-top:15px; }
          .hc-notice{ font-size:11px; padding:10px 12px; }
        }
      `}</style>

      {/* ---------- Notice bar (API থেকে আসলে দেখাবে) ---------- */}
      {notice && (
        <div className="hc-notice">
          <span className="hc-notice-mark" style={{ display: "inline-flex", verticalAlign: "-2px" }}><Icon name="spark" size={13} color="#a6f36a" /></span>
          <span>{notice}</span>
        </div>
      )}

      {/* ---------- Flash sale ---------- */}
      {flashSale && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', padding: '13px 16px', borderRadius: '16px', marginBottom: '22px', background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.16), rgba(166, 243, 106, 0.1))', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fecaca' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ef4444', color: '#ffffff', fontSize: '11px', fontWeight: '900', padding: '4px 10px', borderRadius: '999px', letterSpacing: '0.5px' }}>
            <Icon name="bolt" size={12} color="#ffffff" /> {t.shop.flashLabel}
          </span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', flex: 1, minWidth: '180px' }}>{flashSale.title}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#fca5a5', fontWeight: '700' }}>
            <Icon name="clock" size={14} color="#fca5a5" /> {t.shop.flashEndsIn} <strong style={{ color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>{flashLeft}</strong>
          </span>
        </div>
      )}

      {/* ---------- Hero ---------- */}
      <section className="hc-hero">
        <div className="hc-hero-content">
          <div className="hc-eyebrow">{t.home.eyebrow}</div>
          <h1>
            {t.home.heroTitle1}
            <br />
            <em>{t.home.heroTitle2}</em>
          </h1>
          <p>{t.home.heroSub}</p>
          <div className="hc-hero-actions">
            <Link href="/categories" className="hc-primary">
              {t.home.explore} <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/orders" className="hc-secondary">
              {t.home.trackOrder}
            </Link>
          </div>
        </div>
              {products.length > 0 && (
          <div className="hc-hero-visual" aria-hidden="true">
            <div className="hc-hero-card main">
              <img decoding="async" src={products[0].image} alt="" />
              <span>৳{products[0].price}</span>
            </div>
            {products[1] && (
              <div className="hc-hero-card sub">
                <img decoding="async" src={products[1].image} alt="" />
                <span>৳{products[1].price}</span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ---------- Benefits ---------- */}
      <section className="hc-benefits" aria-label="Store benefits">
        <div className="hc-benefit">
          <span className="hc-benefit-icon"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg></span>
          <div>
            <strong>{t.home.benefit1Title}</strong>
            <small>{t.home.benefit1Sub}</small>
          </div>
        </div>
        <div className="hc-benefit">
          <span className="hc-benefit-icon"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
          <div>
            <strong>{t.home.benefit2Title}</strong>
            <small>{t.home.benefit2Sub}</small>
          </div>
        </div>
        <div className="hc-benefit">
          <span className="hc-benefit-icon"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span>
          <div>
            <strong>{t.home.benefit3Title}</strong>
            <small>{t.home.benefit3Sub}</small>
          </div>
        </div>
      </section>

      {/* ---------- Popular picks / Products ---------- */}
      <section aria-labelledby="products-heading">
        <div className="hc-section-head">
          <div>
            <div className="hc-kicker">{t.home.kicker}</div>
            <h2 id="products-heading">{t.home.popular}</h2>
            <p>{t.home.popularSub}</p>
          </div>
          <Link href="/categories" className="hc-all-link">
            {t.home.browseAll}
          </Link>
        </div>

        {loading ? (
          <div className="hc-product-grid hc-pop-grid">
            {[1, 2, 3, 4].map((n) => (
              <div className="hc-skeleton" key={n} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="hc-empty">
            <div style={{ fontSize: 28, marginBottom: 10 }}>◌</div>
            <strong style={{ color: '#e7ebf0', display: 'block', marginBottom: 7 }}>
              {t.home.emptyTitle}
            </strong>
            <span>{t.home.emptySub}</span>
          </div>
        ) : (
          <div className="hc-product-grid hc-pop-grid">
            {products.map((prod) => (
              <Link key={prod.id} href={`/product/${prod.id}`} className="hc-product">
                <div className="hc-product-media">
                  <WishHeart productId={prod.id} />
                  <img
                    src={productImageSrc(prod, LOGO_HUB_CART)}
                    alt={prod.title || 'Hub Cart product'}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = LOGO_HUB_CART;
                    }}
                  />
                  {prod.original_price && Number(prod.original_price) > Number(prod.price) && (
                    <span className="hc-off-badge">-{Math.round((1 - Number(prod.price) / Number(prod.original_price)) * 100)}%</span>
                  )}
                </div>
                <div className="hc-product-body">
                  <h3 className="hc-product-title">{prod.title}</h3>
                  {prod.reviewCount > 0 && (
                    <div style={{ fontSize: '11px', color: '#facc15', fontWeight: '700', marginBottom: '6px' }}>
                      {'★'.repeat(Math.round(prod.rating))}<span style={{ color: '#475569' }}>{'★'.repeat(5 - Math.round(prod.rating))}</span>
                      <span style={{ color: '#e2e8f0', marginLeft: '5px' }}>{prod.rating}</span>
                      <span style={{ color: '#64748b', marginLeft: '3px' }}>({prod.reviewCount})</span>
                    </div>
                  )}
                  <div className="hc-product-meta">{t.home.productMeta}</div>
                  <div className="hc-product-bottom">
                    <span>
                      <span className="hc-price">৳{prod.price}</span>
                      {prod.original_price && Number(prod.original_price) > Number(prod.price) && (
                        <span className="hc-old-price">৳{prod.original_price}</span>
                      )}
                    </span>
                    <span className="hc-buy" aria-label="View product">
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Recently viewed ---------- */}
      {recent.length > 0 && (
        <section aria-label={t.shop.recentTitle} style={{ marginTop: '48px' }}>
          <div className="hc-section-head">
            <div>
              <div className="hc-kicker">{t.shop.recentTitle}</div>
              <h2 style={{ fontFamily: 'Manrope,sans-serif', fontSize: 'clamp(20px,2.6vw,26px)', letterSpacing: '-0.8px', margin: 0, fontWeight: 800 }}>{t.shop.recentTitle}</h2>
            </div>
          </div>
          <div className="hc-product-grid">
            {recent.slice(0, 4).map((prod) => (
              <Link key={prod.id} href={`/product/${prod.id}`} className="hc-product">
                <div className="hc-product-media">
                  <WishHeart productId={prod.id} />
                  <img src={productImageSrc(prod, LOGO_HUB_CART)} alt={prod.title || 'Hub Cart product'} loading="lazy" onError={(e) => { e.currentTarget.src = LOGO_HUB_CART; }} />
                  {prod.original_price && Number(prod.original_price) > Number(prod.price) && (
                    <span className="hc-off-badge">-{Math.round((1 - Number(prod.price) / Number(prod.original_price)) * 100)}%</span>
                  )}
                </div>
                <div className="hc-product-body">
                  <h3 className="hc-product-title">{prod.title}</h3>
                  <div className="hc-product-bottom">
                    <span>
                      <span className="hc-price">৳{prod.price}</span>
                      {prod.original_price && Number(prod.original_price) > Number(prod.price) && (
                        <span className="hc-old-price">৳{prod.original_price}</span>
                      )}
                    </span>
                    <span className="hc-buy" aria-label="View product">↗</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Footer note ---------- */}
      <aside className="hc-footer-note">
        <div>
          <strong>{t.home.footerNoteTitle}</strong>
          <p>{t.home.footerNoteSub}</p>
        </div>
        <Link href="/categories" className="hc-primary">
          {t.home.discoverMore}
        </Link>
      </aside>
    </main>
  );
}
