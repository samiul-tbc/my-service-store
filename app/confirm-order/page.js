'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const COUNTRY_CODES = [
  { code: '+880', flag: '🇧🇩', name: 'BD', placeholder: '1XXXXXXXXX' },
  { code: '+977', flag: '🇳🇵', name: 'NP', placeholder: '98XXXXXXXX' },
  { code: '+91',  flag: '🇮🇳', name: 'IN', placeholder: '9XXXXXXXXX' },
  { code: '+1',   flag: '🇺🇸', name: 'US', placeholder: 'XXXXXXXXXX' },
  { code: '+44',  flag: '🇬🇧', name: 'UK', placeholder: 'XXXXXXXXXX' },
];

export default function ConfirmPage() {
  const router = useRouter();

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
      alert('দয়া করে আপনার নাম লিখুন');
      return;
    }

    if (!phoneNumber.trim()) {
      alert('দয়া করে WhatsApp নম্বরটি লিখুন');
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

    // ১. সবার আগে লোকাল স্টোরেজে ডেটা সংরক্ষণ (যাতে ডেটা কোনো অবস্থাতেই না হারায়)
    try {
      localStorage.setItem('hubcart_current_order', JSON.stringify(fullOrder));
      localStorage.setItem('hubcart_user', JSON.stringify({
        name: name.trim(),
        phone: fullPhoneNumber,
        telegram: telegram.trim() || '',
      }));
    } catch (err) {
      console.error('LocalStorage error:', err);
    }

    // ২. WhatsApp SMS ব্যাকগ্রাউন্ডে পাঠিয়ে দেওয়া (পেজ লোডিং আটকে থাকবে না)
    fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: name.trim(),
        phone: fullPhoneNumber,
        orderId: generatedOrderId,
        serviceName: productName,
      }),
    }).catch((waErr) => console.error('WhatsApp background send error:', waErr));

    // ৩. ডাটাবেজে অর্ডার এন্ট্রি করা (সর্বোচ্চ ৩ সেকেন্ডের টাইমআউট)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
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
      clearTimeout(timeoutId);
    } catch (orderErr) {
      console.warn('Database save warning or timeout:', orderErr);
    }

    // ৪. সরাসরি পেমেন্ট নির্বাচন পেজে রিডাইরেক্ট
    window.location.href = '/processedorder';
  };

  return (
    <div style={{ minHeight: '90vh', backgroundColor: '#090d16', color: '#ffffff', padding: '24px 16px 90px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '20px', padding: '24px 20px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
            অর্ডার কনফার্মেশন
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
          অর্ডারের জন্য প্রয়োজনীয় তথ্য দিন
        </p>

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc' }}>
            {productData.title}
          </span>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#38bdf8' }}>
            ৳{productData.price}
          </span>
        </div>

        <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
              আপনার নাম *
            </label>
            <input
              type="text"
              required
              placeholder="আপনার পুরো নাম"
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
              WhatsApp নম্বর *
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
              কান্ট্রি কোড বাদে বাকি অংশ লিখুন (যেমন: 1893432478)
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px', fontWeight: '600' }}>
              Telegram ইউজারনেম (@username)
            </label>
            <input
              type="text"
              placeholder="@username (যদি থাকে)"
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
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '15px',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            }}
          >
            {loading ? 'প্রসেসিং হচ্ছে...' : 'অর্ডার Confirm করুন →'}
          </button>
        </form>

      </div>
    </div>
  );
}
