'use client';
import { useState } from 'react';
import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';

const CATEGORIES = [
  { id: 'android-root', name: 'Android Root' },
  { id: 'android-panel', name: 'Android Panel' },
  { id: 'social-package', name: 'Social Boost' },
  { id: 'subscriptions', name: 'VIP Subs' },
];

export default function SecretAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [activeTab, setActiveTab] = useState('orders');

  // নোটিশ স্টেট
  const [noticeText, setNoticeText] = useState('');
  const [savingNotice, setSavingNotice] = useState(false);

  // প্রোডাক্ট স্টেট
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // অর্ডার স্টেট
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // WhatsApp ডেলিভারি মডাল
  const [deliveryModalOrder, setDeliveryModalOrder] = useState(null);
  const [deliveryExtraNote, setDeliveryExtraNote] = useState('');

  // প্রোডাক্ট ইনপুট স্টেট
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('android-root');
  const [uploadMode, setUploadMode] = useState('file');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // পিন যাচাই
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setPinError(false);
    setVerifying(true);

    try {
      const res = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        loadAllData(pinInput);
      } else {
        setPinError(true);
      }
    } catch (err) {
      alert('ভেরিফিকেশন এরর!');
    } finally {
      setVerifying(false);
    }
  };

  const loadAllData = (pin) => {
    fetchOrders(pin);
    fetchProducts(pin);
    fetchNotice(pin);
  };

  // ১. অর্ডার ফেচ (নিরাপদ সার্ভার কল)
  const fetchOrders = async (pin = pinInput) => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/admin?type=orders', {
        headers: { 'x-admin-pin': pin },
      });
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // ২. প্রোডাক্ট ফেচ (নিরাপদ সার্ভার কল)
  const fetchProducts = async (pin = pinInput) => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/admin?type=products', {
        headers: { 'x-admin-pin': pin },
      });
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // ৩. নোটিশ ফেচ
  const fetchNotice = async (pin = pinInput) => {
    try {
      const res = await fetch('/api/admin?type=notice', {
        headers: { 'x-admin-pin': pin },
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) setNoticeText(data[0].value);
    } catch (err) {
      console.error(err);
    }
  };

  // নোটিশ সেভ (নিরাপদ সার্ভার কল)
  const handleSaveNotice = async (e) => {
    e.preventDefault();
    setSavingNotice(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pinInput,
        },
        body: JSON.stringify({
          action: 'update-notice',
          payload: noticeText.trim(),
        }),
      });

      if (res.ok) alert('📢 নোটিশ সফলভাবে আপডেট হয়েছে!');
      else alert('নোটিশ আপডেট ব্যর্থ হয়েছে!');
    } catch (err) {
      alert('নেটওয়ার্ক এরর!');
    } finally {
      setSavingNotice(false);
    }
  };

  // অর্ডার স্ট্যাটাস আপডেট (নিরাপদ সার্ভার কল)
  const handleUpdateOrderStatus = async (orderDbId, newStatus) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pinInput,
        },
        body: JSON.stringify({ orderDbId, status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === orderDbId ? { ...ord, status: newStatus } : ord))
        );
      } else {
        alert('স্ট্যাটাস আপডেট করা যায়নি!');
      }
    } catch (err) {
      alert('সার্ভার এরর!');
    }
  };

  // সম্পূর্ণ অর্ডার ডিলিট (নিরাপদ সার্ভার কল)
  const handleDeleteOrder = async (orderDbId, orderIdText) => {
    if (!confirm(`আপনি কি নিশ্চিত অর্ডার "${orderIdText}" মুছে ফেলতে চান?`)) return;

    try {
      const res = await fetch(`/api/admin?type=order&id=${orderDbId}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': pinInput },
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((ord) => ord.id !== orderDbId));
        alert('🗑️ অর্ডার ডিলিট সম্পন্ন!');
      } else {
        alert('ডিলিট করা যায়নি!');
      }
    } catch (err) {
      alert('নেটওয়ার্ক সমস্যা!');
    }
  };

  // WhatsApp ডেলিভারি
  const handleSendWhatsAppDelivery = () => {
    if (!deliveryModalOrder) return;

    const ord = deliveryModalOrder;
    const cleanPhone = ord.whatsapp_number.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
    const host = typeof window !== 'undefined' ? window.location.origin : 'https://hubcart.vercel.app';
    const invoiceUrl = `${host}/invoice/${ord.order_id}`;

    let message = ` ${ord.customer_name}! 👋\n\n` +
      `Hub Cart থেকে আপনার অর্ডারটি সফলভাবে সম্পন্ন করা হয়েছে। ✅\n\n` +
      `📦 সার্ভিস: ${ord.service_name}\n` +
      `🆔 অর্ডার আইডি: ${ord.order_id}\n` +
      `💰 মূল্য: ৳${ord.price}\n\n` +
      `📄 ডিজিটাল ক্যাশ মেমো / ইনভয়েস:\n${invoiceUrl}\n\n`;

    if (deliveryExtraNote.trim()) {
      message += `⚡ সার্ভিস বিস্তারিত / এক্সেস তথ্য:\n${deliveryExtraNote.trim()}\n\n`;
    }

    message += `যেকোনো সহায়তায় আমাদের জানান। Hub Cart-এর সাথে থাকার জন্য ধন্যবাদ! 🌟`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    handleUpdateOrderStatus(ord.id, 'completed');
    setDeliveryModalOrder(null);
    setDeliveryExtraNote('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const blobUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(blobUrl);
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 420;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.65));
        } catch (e) {
          reject(new Error('ছবি প্রসেস করা যায়নি'));
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        reject(new Error('ছবি লোড করা যায়নি'));
      };

      img.src = blobUrl;
    });
  };

  // প্রোডাক্ট যোগ (নিরাপদ সার্ভার কল)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalImage = '';

      if (uploadMode === 'file') {
        if (!imageFile) {
          alert('অনুগ্রহ করে ছবি নির্বাচন করুন!');
          setSubmitting(false);
          return;
        }
        finalImage = await compressImage(imageFile);
      } else {
        if (!imageUrl.trim()) {
          alert('অনুগ্রহ করে ছবির লিংক দিন!');
          setSubmitting(false);
          return;
        }
        finalImage = imageUrl.trim();
      }

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pinInput,
        },
        body: JSON.stringify({
          action: 'add-product',
          payload: {
            title: title.trim(),
            category,
            image: finalImage,
            description: description.trim() || '',
            price: Number(price),
            original_price: originalPrice ? Number(originalPrice) : null,
          },
        }),
      });

      if (res.ok) {
        alert('✅ প্রোডাক্ট সফলভাবে যোগ হয়েছে!');
        setTitle('');
        setImageFile(null);
        setImagePreview('');
        setImageUrl('');
        setDescription('');
        setPrice('');
        setOriginalPrice('');
        fetchProducts();
      } else {
        alert('প্রোডাক্ট যোগ করা যায়নি!');
      }
    } catch (err) {
      alert('এরর: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // প্রোডাক্ট ডিলিট (নিরাপদ সার্ভার কল)
  const handleDeleteProduct = async (id, prodTitle) => {
    if (!confirm(`আপনি কি নিশ্চিত "${prodTitle}" ডিলিট করতে চান?`)) return;

    try {
      const res = await fetch(`/api/admin?type=product&id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': pinInput },
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('ডিলিট করা যায়নি!');
      }
    } catch (err) {
      alert('নেটওয়ার্ক সমস্যা!');
    }
  };

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 14px',
    borderRadius: '12px',
    background: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{
          width: '100%',
          maxWidth: '380px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '30px 24px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        }}>
          <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '48px', height: '48px', objectFit: 'contain', margin: '0 auto 12px', filter: 'drop-shadow(0 2px 8px rgba(56, 189, 248, 0.4))' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 6px', color: '#f8fafc' }}>Hub Cart (tbcadsa)</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px' }}>মাস্টার পিন কোড দিয়ে ড্যাশবোর্ডে প্রবেশ করুন</p>

          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              maxLength={10}
              placeholder="••••"
              value={pinInput}
              onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px',
                textAlign: 'center',
                fontSize: '22px',
                letterSpacing: '8px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.8)',
                border: pinError ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                marginBottom: '14px',
                outline: 'none',
              }}
            />
            {pinError && <div style={{ color: '#f87171', fontSize: '12px', marginBottom: '14px' }}>ভুল পিন কোড! পুনরায় চেষ্টা করুন।</div>}
            
            <button
              type="submit"
              disabled={verifying}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
              }}
            >
              {verifying ? 'যাচাই করা হচ্ছে...' : 'প্রবেশ করুন →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '14px auto', padding: '0 14px 100px' }}>
      
      {/* ড্যাশবোর্ড হেডার */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(16px)',
        padding: '14px 18px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '900', margin: 0, color: '#f8fafc' }}>Hub Cart Manager</h2>
            <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 'bold' }}>● Secure Server API Protected</span>
          </div>
        </div>

        <Link
          href="/"
          style={{
            textDecoration: 'none',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#38bdf8',
            padding: '6px 12px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: 'bold',
          }}
        >
          Live Store ↗
        </Link>
      </div>

      {/* নোটিশ কন্ট্রোল বক্স */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '18px',
        padding: '16px',
        marginBottom: '16px',
      }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '8px' }}>
          📢 হোমপেজ নোটিশ ব্যানার
        </span>
        <form onSubmit={handleSaveNotice} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="হোমপেজে দেখানোর নোটিশ টেক্সট লিখুন..."
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            type="submit"
            disabled={savingNotice}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {savingNotice ? 'সেভ হচ্ছে...' : 'আপডেট'}
          </button>
        </form>
      </div>

      {/* ট্যাব সিলেকশন */}
      <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.7)', padding: '6px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'orders' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
            color: activeTab === 'orders' ? '#ffffff' : '#94a3b8',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          🛒 লাইভ অর্ডার ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'products' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
            color: activeTab === 'products' ? '#ffffff' : '#94a3b8',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          📦 প্রোডাক্ট লিস্ট ({products.length})
        </button>
      </div>

      {/* লাইভ অর্ডার ট্যাব */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>কাস্টমারদের অর্ডার তালিকা</h3>
            <button
              onClick={() => fetchOrders()}
              style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
            >
              🔄 রিফ্রেশ অর্ডার
            </button>
          </div>

          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '13px' }}>অর্ডার তালিকা লোড হচ্ছে...</div>
          ) : orders.length === 0 ? (
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '18px', padding: '36px', textAlign: 'center', color: '#64748b' }}>
              এখনো কোনো অর্ডার আসেনি।
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '18px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>{ord.order_id}</span>
                      <h4 style={{ margin: '2px 0 0', fontSize: '15px', color: '#f8fafc', fontWeight: 'bold' }}>{ord.service_name}</h4>
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: '900', color: '#38bdf8' }}>৳{ord.price}</span>
                  </div>

                  <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px 12px', borderRadius: '12px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '12px' }}>
                    <div>👤 <strong>নাম:</strong> {ord.customer_name}</div>
                    <div>📞 <strong>WhatsApp:</strong> <a href={`https://wa.me/88${ord.whatsapp_number}`} target="_blank" rel="noreferrer" style={{ color: '#4ade80', textDecoration: 'none' }}>{ord.whatsapp_number}</a></div>
                    {ord.telegram_username && <div>✈️ <strong>Telegram:</strong> {ord.telegram_username}</div>}
                    <div>💳 <strong>পেমেন্ট:</strong> {ord.payment_method}</div>
                    <div>🔢 <strong>TrxID:</strong> <code style={{ color: '#f8fafc', background: '#0b0f19', padding: '2px 6px', borderRadius: '4px' }}>{ord.trx_id}</code></div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>স্ট্যাটাস:</span>
                      <select
                        value={ord.status || 'pending'}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        style={{
                          background: '#0b0f19',
                          color: ord.status === 'completed' ? '#4ade80' : ord.status === 'processing' ? '#38bdf8' : ord.status === 'cancelled' ? '#f87171' : '#fbbf24',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="pending">⏳ Pending (গৃহীত)</option>
                        <option value="verifying">🔍 Verifying (যাচাইকরণ)</option>
                        <option value="processing">⚡ Processing (প্রসেসিং)</option>
                        <option value="completed">✅ Completed (সম্পন্ন)</option>
                        <option value="cancelled">❌ Cancelled (বাতিল)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDeleteOrder(ord.id, ord.order_id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      🗑️ ডিলিট
                    </button>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setDeliveryModalOrder(ord);
                        setDeliveryExtraNote('');
                      }}
                      style={{
                        flex: 1,
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        color: '#4ade80',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>📲</span> WhatsApp ডেলিভারি
                    </button>

                    <Link
                      href={`/invoice/${ord.order_id}`}
                      target="_blank"
                      style={{
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        color: '#38bdf8',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      📄 মেমো ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* প্রোডাক্ট ট্যাব */}
      {activeTab === 'products' && (
        <div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(16px)',
            padding: '20px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '24px',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px', color: '#f8fafc' }}>+ নতুন প্রোডাক্ট যোগ করুন</h3>

            <form onSubmit={handleAddProduct}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>প্রোডাক্টের নাম *</label>
                <input required type="text" placeholder="যেমন: Android Mobile Root" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>ক্যাটাগরি *</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, background: '#1e293b' }}>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>বিক্রয় মূল্য (টাকা) *</label>
                  <input required type="number" placeholder="550" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '14px', background: 'rgba(30, 41, 59, 0.6)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setUploadMode('file')}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: uploadMode === 'file' ? '#2563eb' : 'rgba(15, 23, 42, 0.6)', color: '#fff', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
                  >
                    📁 গ্যালারি থেকে আপলোড
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('url')}
                    style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: uploadMode === 'url' ? '#2563eb' : 'rgba(15, 23, 42, 0.6)', color: '#fff', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}
                  >
                    🔗 ছবির লিংক দিন
                  </button>
                </div>

                {uploadMode === 'file' ? (
                  <div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '12px', color: '#94a3b8', background: '#0b0f19' }}
                    />
                    {imagePreview && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={imagePreview} alt="Preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #38bdf8' }} />
                        <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 'bold' }}>✓ ছবি নির্বাচিত হয়েছে</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="url"
                    placeholder="https://... ছবির ডিরেক্ট লিংক"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={inputStyle}
                  />
                )}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>আগের মূল্য (ঐচ্ছিক / Discount)</label>
                <input type="number" placeholder="800" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#94a3b8' }}>বিস্তারিত বিবরণ</label>
                <textarea rows={2} placeholder="সার্ভিস বা প্যাকেজ সম্পর্কে বিস্তারিত লিখুন..." value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                }}
              >
                {submitting ? 'সংরক্ষণ হচ্ছে...' : 'Add Product'}
              </button>
            </form>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>বর্তমান প্রোডাক্ট তালিকা ({products.length})</h3>
              <button onClick={() => fetchProducts()} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>🔄 রিফ্রেশ</button>
            </div>

            {loadingProducts ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>লোড হচ্ছে...</div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>কোনো প্রোডাক্ট পাওয়া যায়নি।</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {products.map((prod) => (
                  <div key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px', background: 'rgba(30, 41, 59, 0.5)' }}>
                    <img src={prod.image} alt={prod.title} style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '10px', background: '#0b0f19' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc' }}>{prod.title}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>৳{prod.price} • {prod.category}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(prod.id, prod.title)}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp ডেলিভারি মডাল */}
      {deliveryModalOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '420px',
            background: '#0f172a',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#f8fafc', fontWeight: 'bold' }}>
                📲 WhatsApp ডেলিভারি নিশ্চিতকরণ
              </h3>
              <button onClick={() => setDeliveryModalOrder(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', color: '#cbd5e1', marginBottom: '14px', lineHeight: 1.5 }}>
              <div>👤 <strong>গ্রাহক:</strong> {deliveryModalOrder.customer_name} ({deliveryModalOrder.whatsapp_number})</div>
              <div>📦 <strong>সার্ভিস:</strong> {deliveryModalOrder.service_name}</div>
              <div>🆔 <strong>অর্ডার:</strong> {deliveryModalOrder.order_id}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '6px' }}>
                সার্ভিস এক্সেস তথ্য / নোট (ঐচ্ছিক):
              </label>
              <textarea
                rows={3}
                placeholder="যেমন: ইউজারনেম, পাসওয়ার্ড, ফাইল ডাউনলোড লিংক..."
                value={deliveryExtraNote}
                onChange={(e) => setDeliveryExtraNote(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setDeliveryModalOrder(null)}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'transparent',
                  color: '#94a3b8',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                বাতিল
              </button>

              <button
                onClick={handleSendWhatsAppDelivery}
                style={{
                  flex: 2,
                  padding: '11px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>🚀</span> WhatsApp-এ পাঠান
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
