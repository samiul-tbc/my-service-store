'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

const ADMIN_PIN = '1234';

const CATEGORIES = [
  { id: 'android-root', name: 'Android Root' },
  { id: 'android-panel', name: 'Android Panel' },
  { id: 'social-package', name: 'Social Package' },
  { id: 'subscriptions', name: 'Subscriptions' },
];

export default function SecretAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // প্রোডাক্ট স্টেট
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ইনপুট স্টেট
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('android-root');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      fetchProducts();
    } else {
      setPinError(true);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`, {
        cache: 'no-store',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // মোবাইল থেকে ছবি নেওয়া
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ছবি স্বয়ংক্রিয়ভাবে ছোট (Compress) ও কনভার্ট করার ফাংশন
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // হালকা ও পরিষ্কার JPEG ফরম্যাটে কনভার্ট
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('অনুগ্রহ করে মোবাইল থেকে একটি প্রোডাক্টের ছবি বেছে নিন!');
      return;
    }

    setSubmitting(true);

    try {
      // ছবি কম্প্রেস করা
      const compressedImageBase64 = await compressImage(imageFile);

      // সরাসরি ডাটাবেজে সংরক্ষণ
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          title,
          category,
          image: compressedImageBase64,
          description: description || '',
          price: Number(price),
          original_price: originalPrice ? Number(originalPrice) : null,
        }),
      });

      if (res.ok) {
        alert('✅ প্রোডাক্ট ও ছবি সফলভাবে যুক্ত হয়েছে!');
        setTitle('');
        setImageFile(null);
        setImagePreview('');
        setDescription('');
        setPrice('');
        setOriginalPrice('');
        fetchProducts();
      } else {
        const errorData = await res.json().catch(() => null);
        alert(`❌ এরর: ${errorData?.message || 'তথ্য সেভ হয়নি'}`);
      }
    } catch (err) {
      alert('এরর: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, prodTitle) => {
    if (!confirm(`আপনি কি "${prodTitle}" ডিলিট করতে চান?`)) return;

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        alert('🗑️ প্রোডাক্ট ডিলিট করা হয়েছে!');
      } else {
        alert('ডিলিট করা যায়নি!');
      }
    } catch (err) {
      alert('নেটওয়ার্ক সমস্যা!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '360px', margin: '60px auto', padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '42px', marginBottom: '8px' }}>🔐</div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px', color: '#0f172a' }}>Secret Access</h2>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px' }}>অ্যাডমিন পিন দিন</p>

        <form onSubmit={handlePinSubmit}>
          <input
            type="password"
            maxLength={10}
            placeholder="PIN"
            value={pinInput}
            onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px', textAlign: 'center', fontSize: '18px', letterSpacing: '4px', borderRadius: '8px', border: pinError ? '1px solid #ef4444' : '1px solid #cbd5e1', marginBottom: '12px' }}
          />
          {pinError && <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>ভুল পিন কোড!</div>}
          <button type="submit" style={{ width: '100%', padding: '11px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', padding: '0 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '14px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>⚙️ Hub Cart Manager (tbcadsa)</h2>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>● Direct Upload (No Bucket Needed)</span>
        </div>
        <Link href="/" style={{ textDecoration: 'none', background: '#f1f5f9', color: '#0f172a', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
          Live Store ↗
        </Link>
      </div>

      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px', color: '#0f172a' }}>+ নতুন প্রোডাক্ট যোগ করুন</h3>

        <form onSubmit={handleAddProduct}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>প্রোডাক্টের নাম *</label>
            <input required type="text" placeholder="যেমন: Android Mobile Temp Root" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>ক্যাটাগরি *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>বিক্রয় মূল্য (টাকা) *</label>
              <input required type="number" placeholder="550" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>প্রোডাক্টের ছবি আপলোড করুন *</label>
            <input
              required
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc' }}
            />
            {imagePreview && (
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <span style={{ fontSize: '12px', color: '#10b981' }}>ছবি রেডি</span>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>আগের মূল্য (ঐচ্ছিক)</label>
            <input type="number" placeholder="800" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>বিবরণ / বিস্তারিত বিবরণ</label>
            <textarea rows={2} placeholder="সার্ভিস বা প্রোডাক্ট সম্পর্কিত বিস্তারিত লিখুন..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
          </div>

          <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
            {submitting ? 'ছবি প্রসেসিং ও আপলোড হচ্ছে...' : 'Add Product'}
          </button>
        </form>
      </div>

      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>বর্তমান প্রোডাক্ট তালিকা ({products.length})</h3>
          <button onClick={fetchProducts} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>🔄 রিফ্রেশ</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>লোড হচ্ছে...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>কোনো প্রোডাক্ট নেই।</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {products.map((prod) => (
              <div key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', border: '1px solid #f1f5f9', borderRadius: '10px', background: '#f8fafc' }}>
                <img src={prod.image} alt={prod.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>{prod.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>৳{prod.price} | {prod.category}</div>
                </div>
                <button
                  onClick={() => handleDeleteProduct(prod.id, prod.title)}
                  style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '7px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
