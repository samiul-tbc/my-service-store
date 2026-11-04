'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmOrderPage() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+880');
  const [telegram, setTelegram] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedProduct = localStorage.getItem('hubcart_selected_product');
    if (savedProduct) {
      try {
        setProduct(JSON.parse(savedProduct));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleConfirmOrder = async (e) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      alert('আপনার নাম লিখুন');
      return;
    }
    if (!phone.trim()) {
      alert('WhatsApp নম্বর লিখুন');
      return;
    }

    setLoading(true);

    // ১. ইউনিক Hub Cart Order ID এবং আন্তর্জাতিক ফোন নম্বর তৈরি
    const generatedOrderId = `HC-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullPhone = `${countryCode}${phone.trim().replace(/^0+/, '')}`;
    const productName = product?.title || product?.name || 'Test Product';
    const productPrice = Number(product?.price) || 10;

    try {
      // ২. সরাসরি Supabase-এ অর্ডার সেভ করা (Admin Panel ও Orders পেজে দৃশ্যমান হবে)
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: generatedOrderId,
          serviceName: productName,
          price: productPrice,
          customerName: name.trim(),
          whatsappNumber: fullPhone,
          telegramUsername: telegram.trim() || 'নেই',
          paymentMethod: 'Processing Payment',
          trxId: 'Pending',
        }),
      });

      // ৩. সাথে সাথে WhatsApp-এ নিশ্চিতকরণ SMS পাঠানো
      try {
        await fetch('/api/send-whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: name.trim(),
            phone: fullPhone,
            orderId: generatedOrderId,
            serviceName: productName,
          }),
        });
      } catch (waErr) {
        console.error('WhatsApp Error:', waErr);
      }

      // ৪. পরের পেমেন্ট পেজের জন্য অর্ডারের তথ্য সেভ রাখা
      localStorage.setItem(
        'hubcart_current_order',
        JSON.stringify({
          id: generatedOrderId,
          orderId: generatedOrderId,
          serviceName: productName,
          price: productPrice,
          customerName: name.trim(),
          whatsappNumber: fullPhone,
          telegramUsername: telegram.trim() || 'নেই',
        })
      );

      // ৫. পেমেন্ট অপশন পেজে পাঠানো
      router.push('/processedorder');

    } catch (err) {
      console.error(err);
      alert('অর্ডার প্রসেস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '20px auto', padding: '16px 16px 80px' }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '24px 20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#f8fafc', margin: 0 }}>
              অর্ডার কনফার্মেশন
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
              অর্ডারের জন্য প্রয়োজনীয় তথ্য দিন
            </p>
          </div>
          <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        {/* সার্ভিস সামারি */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '14px',
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f8fafc' }}>
            {product?.title || product?.name || 'Test Product'}
          </span>
          <span style={{ fontSize: '16px', fontWeight: '900', color: '#38bdf8' }}>
            ৳{product?.price || 10}
          </span>
        </div>

        {/* ইনপুট ফর্ম */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>আপনার নাম *</label>
            <input
              type="text"
              placeholder="Samiul Islam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>WhatsApp নম্বর *</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{
                  padding: '12px 8px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                }}
              >
                <option value="+880">🇧🇩 +880 (BD)</option>
                <option value="+91">🇮🇳 +91 (IN)</option>
                <option value="+1">🇺🇸 +1 (US)</option>
              </select>
              <input
                type="text"
                placeholder="1893432478"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  flex: 1,
                  boxSizing: 'border-box',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <span style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', display: 'block' }}>
              কান্ট্রি কোড বাদে বাকি অংশ লিখুন (যেমন: 1893432478)
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>Telegram ইউজারনেম (@username)</label>
            <input
              type="text"
              placeholder="@username (যদি থাকে)"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <button
            onClick={handleConfirmOrder}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '900',
              fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
            }}
          >
            {loading ? 'প্রসেসিং হচ্ছে...' : 'অর্ডার Confirm করুন →'}
          </button>
        </div>
      </div>
    </div>
  );
}
