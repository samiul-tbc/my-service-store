'use client';
import Link from 'next/link';
import LanguageToggle from '@/components/LanguageToggle';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';

export default function Navbar() {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 90,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '10px 16px',
    }}>
      <div style={{
        maxWidth: '640px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* লোগো ও ব্র্যান্ড নাম */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <div>
            <span style={{ fontSize: '16px', fontWeight: '900', color: '#f8fafc', display: 'block', lineHeight: 1.1 }}>
              Hub Cart
            </span>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#38bdf8', letterSpacing: '0.5px' }}>
              PREMIUM STORE
            </span>
          </div>
        </Link>

        {/* ভাষা পরিবর্তনের সুইচ বাটন */}
        <LanguageToggle />
      </div>
    </header>
  );
}
