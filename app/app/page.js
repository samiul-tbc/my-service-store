'use client';
import { useState } from 'react';

const SERVICES = [
  {
    id: 1,
    title: 'Android Firmware & Root Support',
    description: 'Magisk / KernelSU সেটআপ, Bootloader আনলক ও কাস্টম রম গাইডেন্স।',
    price: 600,
    badge: 'Popular',
  },
  {
    id: 2,
    title: 'Custom Tool License / Key',
    description: 'অনলাইন অটোমেশন বা প্রিমিয়াম ইউটিলিটি টুলসের লাইসেন্স কি।',
    price: 1200,
    badge: 'Instant Key',
  },
  {
    id: 3,
    title: 'Remote Device Diagnostics',
    description: 'AnyDesk/TeamViewer এর মাধ্যমে সফটওয়্যার ইস্যু ফিক্সিং।',
    price: 450,
    badge: 'Live Remote',
  },
];

export default function Home() {
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    contact: '',
    deviceModel: '',
    paymentMethod: 'bKash',
    trxId: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: selectedService.title,
          price: selectedService.price,
          ...formData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        alert(data.error || 'সমস্যা হয়েছে');
      }
    } catch (err) {
      alert('নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#0a0d14', color: '#f1f5f9', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#38bdf8' }}>DevTools & Remote Services</h1>
          <p style={{ color: '#94a3b8', marginTop: '8px' }}>প্রিমিয়াম টুলস ও টেকনিক্যাল সাপোর্ট নিন সহজে</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {SERVICES.map((item) => (
            <div key={item.id} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '24px', position: 'relative' }}>
              <span style={{ fontSize: '12px', background: '#0369a1', color: '#e0f2fe', padding: '3px 8px', borderRadius: '6px' }}>{item.badge}</span>
              <h3 style={{ fontSize: '20px', margin: '14px 0 8px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', minHeight: '40px' }}>{item.description}</p>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', margin: '18px 0' }}>৳{item.price}</div>
              <button
                onClick={() => { setSelectedService(item); setSuccess(false); }}
                style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                অর্ডার করুন
              </button>
            </div>
          ))}
        </div>

        {selectedService && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100 }}>
            <div style={{ background: '#1e293b', padding: '28px', borderRadius: '14px', width: '100%', maxWidth: '440px', position: 'relative' }}>
              <button onClick={() => setSelectedService(null)} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>

              {success ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <h3 style={{ color: '#10b981', fontSize: '22px' }}>অর্ডার গ্রহণ করা হয়েছে!</h3>
                  <p style={{ color: '#cbd5e1', marginTop: '10px' }}>কিছুক্ষণের মধ্যে আপনার সাথে যোগাযোগ করা হবে।</p>
                  <button onClick={() => setSelectedService(null)} style={{ marginTop: '20px', padding: '8px 20px', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px' }}>ঠিক আছে</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>অর্ডার ফর্ম: {selectedService.title}</h2>
                  <p style={{ color: '#38bdf8', marginBottom: '16px', fontSize: '15px' }}>মূল্য: ৳{selectedService.price}</p>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>আপনার নাম *</label>
                    <input required type="text" style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>টেলিগ্রাম ইউজারনেম / হোয়াটসঅ্যাপ নম্বর *</label>
                    <input required type="text" placeholder="@username বা 017xxxxxxxx" style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>ডিভাইসের মডেল / বিবরণ</label>
                    <input type="text" placeholder="যেমন: Redmi Note 10 Pro" style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })} />
                  </div>

                  <div style={{ marginBottom: '12px', display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>পেমেন্ট মাধ্যম</label>
                      <select style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
                        <option value="bKash">bKash</option>
                        <option value="Nagad">Nagad</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>TrxID *</label>
                      <input required type="text" placeholder="TrxID" style={{ width: '100%', padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#fff' }} onChange={(e) => setFormData({ ...formData, trxId: e.target.value })} />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {loading ? 'প্রসেসিং হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
