'use client';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Icon from './icons';

// Coupon input for checkout pages. Validates against /api/coupon and reports
// the applied coupon ({ code, type, value, discount }) to the parent, which
// owns the totals. Applied state also persists in sessionStorage so a page
// revisit keeps it visible.
export default function CouponBox({ subtotal, applied, onApply }) {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const apply = async () => {
    const c = code.trim().toUpperCase();
    if (!c || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: c, subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        onApply({ code: data.code, type: data.type, value: data.value, discount: data.discount });
        setCode('');
      } else {
        setError(t.shop.couponInvalid);
      }
    } catch {
      setError(t.shop.couponInvalid);
    } finally {
      setBusy(false);
    }
  };

  if (applied) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', background: 'rgba(166, 243, 106, 0.08)', border: '1px solid rgba(166, 243, 106, 0.35)', borderRadius: '12px', padding: '10px 14px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: '#a6f36a', fontWeight: '700' }}>
          <Icon name="ticket" size={16} color="#a6f36a" />
          {applied.code} — {t.shop.couponApplied} (−৳{applied.discount})
        </span>
        <button type="button" onClick={() => onApply(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
          {t.shop.couponRemove}
        </button>
      </div>
    );
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
        {t.shop.couponLabel}
      </label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); apply(); } }}
          placeholder={t.shop.couponPlaceholder}
          maxLength={24}
          style={{ flex: 1, boxSizing: 'border-box', padding: '11px 14px', backgroundColor: '#0b1120', border: '1px solid #334155', borderRadius: '10px', color: '#ffffff', fontSize: '14px', outline: 'none', textTransform: 'uppercase', letterSpacing: '1px' }}
        />
        <button
          type="button"
          onClick={apply}
          disabled={busy || !code.trim()}
          style={{ padding: '11px 18px', borderRadius: '10px', border: '1px solid rgba(166, 243, 106, 0.45)', background: 'rgba(166, 243, 106, 0.1)', color: '#a6f36a', fontSize: '13px', fontWeight: '800', cursor: busy ? 'wait' : 'pointer', opacity: !code.trim() ? 0.5 : 1 }}
        >
          {busy ? '...' : t.shop.couponApply}
        </button>
      </div>
      {error && <p style={{ fontSize: '12px', color: '#f87171', margin: '6px 0 0' }}>{error}</p>}
    </div>
  );
}
