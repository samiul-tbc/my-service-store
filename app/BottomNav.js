'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

const HIDE_ON = ['/product/', '/cart', '/cart-checkout', '/confirm', '/confirm-order', '/payment', '/processedorder', '/order-success', '/invoice/', '/birthday'];

const ICONS = {
  home: (<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></>),
  grid: (<><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></>),
  doc: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></>),
  user: (<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></>),
};

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const wrapRef = useRef(null);
  const itemRefs = useRef({});
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const [trans, setTrans] = useState('transform 0.45s cubic-bezier(0.34, 1.45, 0.44, 1), width 0.45s cubic-bezier(0.34, 1.45, 0.44, 1), opacity 0.2s ease');
  const pillRef = useRef({ left: 0, width: 0, ready: false });
  const timerRef = useRef(null);

  const hidden = pathname && HIDE_ON.some((pre) => pathname === pre || pathname.startsWith(pre));

  const navItems = [
    { key: 'home', name: t.nav.home, href: '/', icon: ICONS.home },
    { key: 'categories', name: t.nav.categories, href: '/categories', icon: ICONS.grid },
    { key: 'orders', name: t.nav.orders, href: '/orders', icon: ICONS.doc },
    { key: 'profile', name: t.nav.profile, href: '/profile', icon: ICONS.user },
  ];

  const activeItem = navItems.find((i) => i.href === pathname);

  const measure = () => {
    const el = activeItem ? itemRefs.current[activeItem.key] : null;
    const wrap = wrapRef.current;
    if (el && wrap) {
      const wr = wrap.getBoundingClientRect();
      const br = el.getBoundingClientRect();
      const target = { left: br.left - wr.left, width: br.width, ready: true };
      const prev = pillRef.current;
      const SPRING = 'transform 0.45s cubic-bezier(0.34, 1.45, 0.44, 1), width 0.45s cubic-bezier(0.34, 1.45, 0.44, 1), opacity 0.2s ease';
      if (prev.ready && Math.abs(target.left - prev.left) > 24) {
        // Fluid lens: first stretch to cover both the old and new positions,
        // then spring-settle onto the target tab.
        const l = Math.min(prev.left, target.left);
        const r = Math.max(prev.left + prev.width, target.left + target.width);
        setTrans('transform 0.18s ease-out, width 0.18s ease-out, opacity 0.2s ease');
        const stretched = { left: l, width: r - l, ready: true };
        pillRef.current = stretched;
        setPill(stretched);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setTrans(SPRING);
          pillRef.current = target;
          setPill(target);
        }, 185);
      } else {
        setTrans(SPRING);
        pillRef.current = target;
        setPill(target);
      }
    }
  };

  useLayoutEffect(measure, [pathname, hidden, t]);
  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [pathname, hidden]);

  useEffect(() => {
    if (hidden) {
      pillRef.current = { left: 0, width: 0, ready: false };
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      ref={wrapRef}
      className="hc-bottom-nav"
      style={{
        position: 'fixed',
        bottom: '12px',
        left: '12px',
        right: '12px',
        zIndex: 50,
        background: 'linear-gradient(180deg, rgba(20, 28, 44, 0.66), rgba(10, 14, 22, 0.6))',
        border: '1px solid rgba(255, 255, 255, 0.13)',
        borderRadius: '999px',
        backdropFilter: 'blur(22px) saturate(180%)',
        WebkitBackdropFilter: 'blur(22px) saturate(180%)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.14), inset 0 -1px 0 rgba(255, 255, 255, 0.05), 0 18px 42px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '7px 8px',
        maxWidth: '520px',
        margin: '0 auto',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '7px',
          left: 0,
          height: 'calc(100% - 14px)',
          width: pill.width,
          transform: `translateX(${pill.left}px)`,
          opacity: pill.ready && activeItem ? 1 : 0,
          background: 'linear-gradient(180deg, #c9ff8f 0%, #a6f36a 55%, #8fe34f 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -2px 4px rgba(0,0,0,0.12), 0 4px 14px rgba(166, 243, 106, 0.4)',
          borderRadius: '999px',
          transition: trans,
          willChange: 'transform',
        }}
      />
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.key}
            ref={(el) => { itemRefs.current[item.key] = el; }}
            href={item.href}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              gap: '4px',
              color: isActive ? '#10170c' : '#94a3b8',
              padding: '6px 14px',
              borderRadius: '999px',
              minWidth: '62px',
              fontSize: '11px',
              fontWeight: isActive ? '700' : '400',
              transition: 'color 0.25s ease',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#10170c' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.25s ease' }}>
              {item.icon}
            </svg>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
