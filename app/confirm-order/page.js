'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function ConfirmPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [productData, setProductData] = useState({
    title: 'Test payment',
    price: 10,
    id: `HC-${Date.now().toString().slice(-6)}`
  });

  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [telegram, setTelegram] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [vip, setVip] = useState(null);
  const [bName, setBName] = useState('');
  const [bAge, setBAge] = useState('');
  const [bMsg, setBMsg] = useState('');
  const [bFrom, setBFrom] = useState('');
  const [bTheme, setBTheme] = useState('midnight');
  const isBirthday = productData?.category === 'birthday';

  useEffect(() => {
    try {
      const savedProduct = localStorage.getItem('hubcart_selected_product');
      if (savedProduct) {
        setProductData(JSON.parse(savedProduct));
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
  }, []);

  useEffect(() => {
    const digits = `${selectedCountry.code}${phoneNumber}`.replace(/\D/g, '');
    if (digits.length < 11) { setVip(null); return; }
    const tm = setTimeout(async () => {
      try {
        const r = await fetch('/api/vip-check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: digits, subtotal: Number(productData.price) || 0 }) });
        const d = await r.json();
        if (r.ok) setVip(d);
      } catch {}
    }, 600);
    return () => clearTimeout(tm);
  }, [phoneNumber, selectedCountry, productData]);

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

    if (isBirthday && !bName.trim()) {
      alert(t.bday.alertName);
      return;
    }

    const cleanPhone = phoneNumber.trim().replace(/^0+/, '');
    const fullPhoneNumber = `${selectedCountry.code}${cleanPhone}`;

    const generatedOrderId = productData.id && String(productData.id).startsWith('HC-') 
      ? productData.id 
      : `HC-${Math.floor(1000 + Math.random() * 9000)}`;

    const productName = productData.title || productData.serviceName || 'Product Order';
    const productPrice = Number(productData.price) || 10;
    const discount = coupon ? couponDiscount(coupon, productPrice) : (vip && vip.eligible ? Math.round(productPrice * 0.05) : 0);

    const fullOrder = {
      id: generatedOrderId,
      orderId: generatedOrderId,
      title: productName,
      serviceName: productName,
      price: productPrice - discount,
      subtotal: productPrice,
      discount: discount,
      couponCode: coupon ? coupon.code : '',
      vipApplied: !coupon && discount > 0,
      birthday: isBirthday ? { name: bName.trim(), age: bAge.trim(), msg: bMsg.trim(), from: bFrom.trim(), theme: bTheme } : null,
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

    // Kono rokom API ba wait chara instant redirect!
    window.location.href = '/processedorder';
  };

  return (
    <div style={{ minHeight: '90vh', backgroundColor: '#090d16', color: '#ffffff', padding: '24px 16px 90px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '20px', padding: '24px 20px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
            {t.confirm.title}
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

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc' }}>
            {productData.title}
          </span>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#a6f36a' }}>
            ৳{productData.price}
          </span>
        </div>

        <div style={{ backgroundColor: '#0b1220', border: '1px dashed #334155', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '700' }}><span style={{ display: "inline-flex", verticalAlign: "-3px", marginRight: "5px" }}><Icon name="card" size={15} color="#a6f36a" /></span>{t.confirm.payPreviewTitle}</span>
            <span style={{ fontSize: '13px', color: '#a6f36a', fontWeight: '800' }}>{t.confirm.totalDue}: ৳{Number(productData.price) - (coupon ? couponDiscount(coupon, Number(productData.price) || 0) : 0)}</span>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.6 }}>{t.confirm.payPreviewNote}</p>
          <div style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '700' }}>bKash • Nagad • Rocket • Upay • Crypto</div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <CouponBox subtotal={Number(productData.price) || 0} applied={coupon} onApply={setCoupon} />
        </div>
        {vip && !coupon && vip.eligible && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(166, 243, 106, 0.1)', border: '1px solid rgba(166, 243, 106, 0.4)', borderRadius: '12px', padding: '10px 12px', marginBottom: '20px' }}>
            <Icon name="gift" size={16} color="#a6f36a" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#a6f36a' }}>{t.shop.vipReward.replace('{amount}', String(vip.discount || 0))}</span>
          </div>
        )}
        {vip && !coupon && !vip.eligible && vip.completed > 0 && (
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px' }}>{t.shop.vipNext.replace('{n}', String(vip.toNext || 3))}</p>
        )}


        <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isBirthday && (
            <div style={{ background: 'rgba(244, 114, 182, 0.07)', border: '1px solid rgba(244, 114, 182, 0.35)', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '14px', fontWeight: '800', color: '#f9a8d4', marginBottom: '12px' }}>
                <Icon name="gift" size={16} color="#f9a8d4" /> {t.bday.formTitle}
              </div>
              <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '5px', fontWeight: '600' }}>{t.bday.forName} *</label>
              <input type="text" value={bName} onChange={(e) => setBName(e.target.value)} placeholder={t.bday.forNamePh} style={{ width: '100%', padding: '11px 12px', background: '#0b1220', border: '1px solid #26334d', borderRadius: '10px', color: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }} />
              <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '5px', fontWeight: '600' }}>{t.bday.age}</label>
              <input type="number" min="1" max="120" value={bAge} onChange={(e) => setBAge(e.target.value)} placeholder={t.bday.agePh} style={{ width: '100%', padding: '11px 12px', background: '#0b1220', border: '1px solid #26334d', borderRadius: '10px', color: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }} />
              <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '5px', fontWeight: '600' }}>{t.bday.msg}</label>
              <textarea value={bMsg} onChange={(e) => setBMsg(e.target.value)} placeholder={t.bday.msgPh} rows={3} maxLength={400} style={{ width: '100%', padding: '11px 12px', background: '#0b1220', border: '1px solid #26334d', borderRadius: '10px', color: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px', resize: 'vertical' }} />
              <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '5px', fontWeight: '600' }}>{t.bday.from}</label>
              <input type="text" value={bFrom} onChange={(e) => setBFrom(e.target.value)} placeholder={t.bday.fromPh} style={{ width: '100%', padding: '11px 12px', background: '#0b1220', border: '1px solid #26334d', borderRadius: '10px', color: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }} />
              <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>{t.bday.theme}</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'midnight', label: t.bday.themeMidnight, c1: '#1d0b38', c2: '#ffd166' },
                  { id: 'candy', label: t.bday.themeCandy, c1: '#42082c', c2: '#fb7185' },
                  { id: 'ocean', label: t.bday.themeOcean, c1: '#07305c', c2: '#38bdf8' },
                ].map((th) => (
                  <button key={th.id} type="button" onClick={() => setBTheme(th.id)} style={{ flex: 1, padding: '9px 4px', borderRadius: '10px', border: bTheme === th.id ? `2px solid ${th.c2}` : '1px solid #26334d', background: th.c1, color: '#f8fafc', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                    <span style={{ display: 'block', width: '16px', height: '16px', borderRadius: '50%', background: th.c2, margin: '0 auto 5px' }} />
                    {th.label}
                  </button>
                ))}
              </div>
            </div>
          )}
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
