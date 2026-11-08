'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import Icon from '../../components/icons';
import CouponBox from '../../components/CouponBox';
import { couponDiscount } from '../../lib/shop';

const COUNTRY_CODES = [
  { code: '+880', name: 'BD', placeholder: '1XXXXXXXXX' },
  { code: '+977', name: 'NP', placeholder: '98XXXXXXXX' },
  { code: '+91',  name: 'IN', placeholder: '9XXXXXXXXX' },
  { code: '+1',   name: 'US', placeholder: 'XXXXXXXXXX' },
  { code: '+44',  name: 'UK', placeholder: 'XXXXXXXXXX' },
];

export default function CartCheckoutPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [telegram, setTelegram] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [vip, setVip] = useState(null);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('hubcart_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }

      const savedUser = localStorage.getItem('hubcart_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.name) setName(parsedUser.name);
        if (parsedUser.telegram) setTelegram(parsedUser.telegram);

        if (parsedUser.phone) {
          const matchedCountry = COUNTRY_CODES.find((c) => parsedUser.phone.startsWith(c.code));
          if (matchedCountry) {
            setSelectedCountry(matchedCountry);
            setPhoneNumber(parsedUser.phone.replace(matchedCountry.code, ''));
          } else {
            setPhoneNumber(parsedUser.phone.replace(/^\+880|^0/, ''));
          }
        }
      }
    } catch (e) {
      console.error('Error loading data from localStorage:', e);
    }
    setLoaded(true);
  }, []);

  const total = items.reduce((acc, item) => acc + Number(item.price || 0) * (item.quantity || 1), 0);
  const vipDiscount = !coupon && vip && vip.eligible ? Math.round(total * 0.05) : 0;
  const discount = coupon ? couponDiscount(coupon, total) : vipDiscount;
  const finalTotal = total - discount;

  useEffect(() => {
    const digits = `${selectedCountry.code}${phoneNumber}`.replace(/\D/g, '');
    if (digits.length < 11) { setVip(null); return; }
    const tm = setTimeout(async () => {
      try {
        const r = await fetch('/api/vip-check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: digits, subtotal: total }) });
        const d = await r.json();
        if (r.ok) setVip(d);
      } catch {}
    }, 600);
    return () => clearTimeout(tm);
  }, [phoneNumber, selectedCountry, total]);

  const handleOrderSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert(t.confirm.alertName);
      return;
    }

    if (!phoneNumber.trim()) {
      alert(t.confirm.alertPhone);
      return;
    }

    const cleanPhone = phoneNumber.trim().replace(/^0+/, '');
    const fullPhoneNumber = `${selectedCountry.code}${cleanPhone}`;

    const generatedOrderId = `HC-${Math.floor(1000 + Math.random() * 9000)}`;

    const serviceName = (
      'Cart Order: ' +
      items
        .map((item) => item.title + ((item.quantity || 1) > 1 ? ` (x${item.quantity})` : ''))
        .join(', ')
    ).slice(0, 220);

    const fullOrder = {
      id: generatedOrderId,
      orderId: generatedOrderId,
      title: serviceName,
      serviceName: serviceName,
      price: finalTotal,
      subtotal: total,
      discount: discount,
      couponCode: coupon ? coupon.code : '',
      vipApplied: vipDiscount > 0,
      category: items.length > 0 && items.every((i) => i.category === 'e-service') ? 'e-service' : '',
      customerName: name.trim(),
      whatsappNumber: fullPhoneNumber,
      telegramUsername: telegram.trim() || 'N/A',
    };

    // Data LocalStorage-e save kora
    localStorage.setItem('hubcart_current_order', JSON.stringify(fullOrder));
    localStorage.setItem('hubcart_user', JSON.stringify({
      name: name.trim(),
      phone: fullPhoneNumber,
      telegram: telegram.trim() || '',
    }));
    // পেমেন্ট সফল হলে কার্ট খালি করার ফ্ল্যাগ
    localStorage.setItem('hubcart_pending_cart_clear', '1');

    // Kono rokom API ba wait chara instant redirect!
    window.location.href = '/processedorder';
  };

  if (!loaded) {
    return (
      <div style={{ minHeight: '90vh', backgroundColor: '#090d16', color: '#ffffff', padding: '24px 16px 90px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '90vh', backgroundColor: '#090d16', color: '#ffffff', padding: '24px 16px 90px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '20px', padding: '32px 20px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#cbd5e1', margin: '0 0 22px', lineHeight: 1.6 }}>
            {t.ccheckout.empty}
          </p>
          <Link
            href="/categories"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #a6f36a, #d2ffad)',
              color: '#10170c',
              padding: '12px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '13px',
              boxShadow: '0 4px 15px rgba(166, 243, 106, 0.35)',
            }}
          >
            {t.cart.browse}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '90vh', backgroundColor: '#090d16', color: '#ffffff', padding: '24px 16px 90px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '20px', padding: '24px 20px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
            {t.ccheckout.title}
          </h2>
          <button
            type="button"
            onClick={() => router.back()}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 18px 0' }}>
          {t.confirm.subtitle}
        </p>

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', marginBottom: '10px' }}>
            {t.ccheckout.itemsTitle}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map((item) => {
              const qty = item.quantity || 1;
              return (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>
                    {item.title}{qty > 1 ? ` ×${qty}` : ''}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#f8fafc', whiteSpace: 'nowrap' }}>
                    ৳{Number(item.price || 0) * qty}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', marginTop: '12px', paddingTop: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>{t.cart.total}</span>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#a6f36a' }}>৳{total}</span>
          </div>
          {discount > 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>{t.shop.discount} ({coupon.code})</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#f87171' }}>−৳{discount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>{t.confirm.totalDue}</span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#a6f36a' }}>৳{finalTotal}</span>
              </div>
            </>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <CouponBox subtotal={total} applied={coupon} onApply={setCoupon} />
        {vip && !coupon && vip.eligible && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(166, 243, 106, 0.1)', border: '1px solid rgba(166, 243, 106, 0.4)', borderRadius: '12px', padding: '10px 12px', marginTop: '12px' }}>
            <Icon name="gift" size={16} color="#a6f36a" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#a6f36a' }}>{t.shop.vipReward.replace('{amount}', String(vip.discount || 0))}</span>
          </div>
        )}
        {vip && !coupon && !vip.eligible && vip.completed > 0 && (
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px' }}>{t.shop.vipNext.replace('{n}', String(vip.toNext || 3))}</p>
        )}

        </div>

        <div style={{ backgroundColor: '#0b1220', border: '1px dashed #334155', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '700' }}><span style={{ display: "inline-flex", verticalAlign: "-3px", marginRight: "5px" }}><Icon name="card" size={15} color="#a6f36a" /></span>{t.confirm.payPreviewTitle}</span>
            <span style={{ fontSize: '13px', color: '#a6f36a', fontWeight: '800' }}>{t.confirm.totalDue}: ৳{finalTotal}</span>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.6 }}>{t.confirm.payPreviewNote}</p>
          <div style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '700' }}>bKash • Nagad • Rocket • Upay • Crypto</div>
        </div>

        <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
              {t.confirm.name}
            </label>
            <input
              type="text"
              required
              placeholder={t.confirm.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                backgroundColor: '#0b1120',
                border: '1px solid #334155',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
              {t.confirm.whatsapp}
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={selectedCountry.code}
                onChange={(e) => {
                  const country = COUNTRY_CODES.find((c) => c.code === e.target.value);
                  if (country) setSelectedCountry(country);
                }}
                style={{
                  backgroundColor: '#0b1120',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '12px 8px',
                  outline: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code} style={{ backgroundColor: '#111827', color: '#ffffff' }}>
                    {c.flag} {c.code} ({c.name})
                  </option>
                ))}
              </select>

              <input
                type="tel"
                required
                placeholder={selectedCountry.placeholder}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  backgroundColor: '#0b1120',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
              {t.confirm.phoneHint}
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
              {t.confirm.telegram}
            </label>
            <input
              type="text"
              placeholder={t.confirm.telegramPlaceholder}
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                backgroundColor: '#0b1120',
                border: '1px solid #334155',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '14px',
              backgroundColor: '#a6f36a',
              color: '#10170c',
              fontWeight: '700',
              fontSize: '15px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(166, 243, 106, 0.4)',
            }}
          >
            {t.confirm.btn}
          </button>
        </form>

      </div>
    </div>
  );
}
