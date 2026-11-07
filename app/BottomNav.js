'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      name: t.nav.home,
      href: '/',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#a6f36a" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
    },
    {
      name: t.nav.categories,
      href: '/categories',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#a6f36a" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      name: t.nav.orders,
      href: '/orders',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#a6f36a" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
    },
    {
      name: t.nav.profile,
      href: '/profile',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#a6f36a" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
  ];

  return (
    <div className="hc-bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(8, 11, 16, 0.92)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 10px 12px',
    }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              gap: '4px',
              color: isActive ? '#a6f36a' : '#94a3b8',
              background: isActive ? 'rgba(166, 243, 106, 0.12)' : 'transparent',
              padding: '6px 14px',
              borderRadius: '14px',
              minWidth: '62px',
              fontSize: '11px',
              fontWeight: isActive ? '600' : '400',
              transition: 'all 0.2s ease',
            }}
          >
            {item.icon(isActive)}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
