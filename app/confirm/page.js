'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';

const COUNTRY_CODES = [
  { code: '+880', flag: '🇧🇩', name: 'BD', placeholder: '1XXXXXXXXX' },
  { code: '+977', flag: '🇳🇵', name: 'NP', placeholder: '98XXXXXXXX' },
  { code: '+91',  flag: '🇮🇳', name: 'IN', placeholder: '9XXXXXXXXX' },
  { code: '+1',   flag: '🇺🇸', name: 'US', placeholder: 'XXXXXXXXXX' },
  { code: '+44',  flag: '🇬🇧', name: 'UK', placeholder: 'XXXXXXXXXX' },
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
  const [loading, setLoading] = useState(false);

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

  const handleOrderSubmit = async (e) => {
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

    setLoading(true);

    const generatedOrderId = productData.id && String(productData.id).startsWith('HC-') 
      ? productData.id 
      : `HC-${Math.floor(1000 + Math.random() * 9000)}`;

    const productName = productData.title || productData.serviceName || 'Product Order';
    const productPrice = Number(productData.price) || 10;

    try {
      // ১. ডাটাবেজে (Supabase) সরাসরি অর্ডার সেভ করা
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: generatedOrderId,
          serviceName: productName,
          price: productPrice,
          customerName: name.trim(),
          whatsappNumber: fullPhoneNumber,
          telegramUsername: telegram.trim() || 'N/A',
          paymentMethod: 'Processing Payment',
          trxId: 'Pending',
        }),
      });

      // ২. WhatsApp-এ ইনস্ট্যান্ট কনফার্মেশন মেসেজ পাঠানো
      try {
        await fetch('/api/send-whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: name.trim(),
            phone: fullPhoneNumber,
            orderId: generatedOrderId,
            serviceName: productName,
          }),
        });
      } catch (waErr) {
        console.error('WhatsApp Error:', waErr);
      }

      // ৩. লোকাল স্টোরেজ আপডেট
      const fullOrder = {
        id: generatedOrderId,
        orderId: generatedOrderId,
        title: productName,
        serviceName: productName,
        price: productPrice,
        customerName: name.trim(),
        whatsappNumber: fullPhoneNumber,
        telegramUsername: telegram.trim() || 'N/A',
      };

      localStorage.setItem('hubcart_current_order', JSON.stringify(fullOrder));
      localStorage.setItem('hubcart_user', JSON.stringify({
        name: name.trim(),
        phone: fullPhoneNumber,
        telegram: telegram.trim() || '',
      }));

      // ৪. পেমেন্ট পেজে পাঠানো
      router.push('/processedorder');

    } catch (err) {
      console.error('Order submission error:', err);
      alert(t.confirm.alertFail);
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
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
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(166, 243, 106, 0.4)',
            }}
          >
            {loading ? t.confirm.processing : t.confirm.btn}
          </button>
        </form>

      </div>
    </div>
  );
}
