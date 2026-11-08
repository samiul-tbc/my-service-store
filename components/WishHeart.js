'use client';
import { useState, useEffect } from 'react';
import Icon from './icons';
import { isWished, toggleWishlist } from '../lib/shop';

// Heart toggle for product cards. Sits inside a <Link> card, so it must
// stop navigation when tapped.
export default function WishHeart({ productId, style, onToggle }) {
  const [wished, setWished] = useState(false);

  useEffect(() => { setWished(isWished(productId)); }, [productId]);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleWishlist(productId);
    setWished(next);
    if (onToggle) onToggle(next);
  };

  return (
    <button
      type="button"
      aria-label="Wishlist"
      onClick={onClick}
      style={{
        position: 'absolute', top: '8px', right: '8px', zIndex: 3,
        width: '32px', height: '32px', borderRadius: '50%',
        display: 'grid', placeItems: 'center', cursor: 'pointer',
        background: wished ? 'rgba(239, 68, 68, 0.9)' : 'rgba(8, 11, 16, 0.55)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        transition: 'transform 0.15s ease, background 0.2s ease',
        ...style,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? '#ffffff' : 'none'} stroke={wished ? '#ffffff' : '#e2e8f0'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
