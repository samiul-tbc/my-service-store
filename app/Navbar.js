'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

const LOGO_HUB_CART = '/logo-icon.png';

export default function Navbar() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    if (!searchOpen || catalog.length) return;
    (async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        if (Array.isArray(data.products)) setCatalog(data.products);
      } catch (e) { console.error(e); }
    })();
  }, [searchOpen, catalog.length]);

  const q = searchQuery.trim().toLowerCase();
  const suggestions = q
    ? catalog.filter((p) => (p.title || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q)).slice(0, 6)
    : catalog.slice(0, 4);

  const goProduct = (id) => {
    setSearchOpen(false);
    setSearchQuery('');
    router.push(`/product/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    router.push(q ? `/categories?q=${encodeURIComponent(q)}` : '/categories');
  };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('hubcart_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error('User parse error:', e);
      }
    }
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 90,
      background: 'linear-gradient(180deg, rgba(16, 22, 34, 0.72), rgba(8, 11, 16, 0.62))',
      backdropFilter: 'blur(20px) saturate(170%)',
      WebkitBackdropFilter: 'blur(20px) saturate(170%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 10px 32px rgba(0, 0, 0, 0.28)',
      padding: '13px 20px',
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        
        {/* লোগো */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <div>
            <span style={{ fontSize: '15px', fontWeight: '900', color: '#f8fafc', display: 'block', lineHeight: 1.1 }}>
              Hub Cart
            </span>
            <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#a6f36a', letterSpacing: '0.5px' }}>
              {t.nav.premiumStore}
            </span>
          </div>
        </Link>

        {/* ডেস্কটপ নেভিগেশন (শুধু বড় স্ক্রিনে) */}
        <nav className="hc-desktop-nav">
          <Link href="/">{t.nav.home}</Link>
          <Link href="/categories">{t.nav.categories}</Link>
          <Link href="/orders">{t.nav.orders}</Link>
          <Link href="/track">{t.footer.trackOrder}</Link>
          <Link href="/cart">{t.footer.cart}</Link>
          <Link href="/profile">{t.nav.profile}</Link>
        </nav>

        {/* ডানপাশের আইকনসমূহ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* ভাষা বাটন */}
          <LanguageToggle />

          {/* সার্চ বাটন */}
          <button
            type="button"
            aria-label="Search services"
            onClick={() => setSearchOpen((v) => !v)}
            style={{ color: searchOpen ? '#a6f36a' : '#94a3b8', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {/* মেমো বাটন */}
          <Link href="/orders" style={{ color: '#a6f36a', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </Link>

          {/* ইউজার স্টেট বাটন (লগইন থাকলে নাম, না থাকলে Login বাটন) */}
          {mounted && (
            user ? (
              <Link
                href="/profile"
                style={{
                  textDecoration: 'none',
                  background: 'rgba(166, 243, 106, 0.2)',
                  border: '1px solid rgba(166, 243, 106, 0.4)',
                  borderRadius: '20px',
                  padding: '3px 8px 3px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#a6f36a',
                  color: '#10170c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '900',
                }}>
                  {(user.name || user.full_name || 'U')[0].toUpperCase()}
                </div>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#f8fafc', maxWidth: '65px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {(user.name || user.full_name || 'User').split(' ')[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                style={{
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #a6f36a, #d2ffad)',
                  borderRadius: '16px',
                  padding: '5px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10170c',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 12px rgba(166, 243, 106, 0.15)',
                }}
              >
                {t.nav.login}
              </Link>
            )
          )}

        </div>

      </div>
    
      {searchOpen && (
        <div style={{ position: 'relative', maxWidth: '1240px', margin: '0 auto' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <input
              autoFocus
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(166, 243, 106, 0.35)', color: '#fff', fontSize: '13px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '10px 16px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #a6f36a, #d2ffad)', color: '#10170c', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              {t.nav.search}
            </button>
          </form>
          {suggestions.length > 0 && (
            <div style={{ marginTop: '8px', background: 'rgba(13, 18, 28, 0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', padding: '6px', boxShadow: '0 18px 40px rgba(0,0,0,0.45)' }}>
              {!q && <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#64748b', padding: '6px 10px 2px' }}>{t.shop.popularSearches}</div>}
              {suggestions.map((p) => (
                <button key={p.id} type="button" onClick={() => goProduct(p.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '8px 10px', borderRadius: '10px', cursor: 'pointer', color: '#e2e8f0' }}>
                  <img src={`/api/img/${p.id}`} alt="" style={{ width: '34px', height: '34px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <span style={{ flex: 1, minWidth: 0, fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</span>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#a6f36a', flexShrink: 0 }}>৳{p.price}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
