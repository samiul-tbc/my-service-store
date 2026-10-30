'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Supabase Credentials
const SUPABASE_URL = 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = 'Sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';

// Secret PIN (Dorkar hole change kore neben)
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

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // New product form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('android-root');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // PIN check
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      fetchProducts();
    } else {
      setPinError(true);
    }
  };

  // Supabase theke product ana
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      alert('Product load korte problem hoyeche!');
    } finally {
      setLoading(false);
    }
  };

  // Notun product add kora
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
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
          image,
          description,
          price: Number(price),
          original_price: originalPrice ? Number(originalPrice) : null,
        }),
      });

      if (res.ok) {
        alert('Product successfully add hoyeche!');
        setTitle('');
        setImage('');
        setDescription('');
        setPrice('');
        setOriginalPrice('');
        fetchProducts();
      } else {
        alert('Product add kora jayni, details check korun.');
      }
    } catch (err) {
      alert('Server error!');
    } finally {
      setSubmitting(false);
    }
  };

  // Product delete kora
  const handleDeleteProduct = async (id, prodTitle) => {
    if (!confirm(`Apni ki confirm "${prodTitle}" delete korte chan?`)) return;

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
        alert('Product delete kora hoyeche!');
      } else {
        alert('Delete korte problem hoyeche!');
      }
    } catch (err) {
      alert('Network error!');
    }
  };

  // PIN Screen
  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '360px', margin: '60px auto', padding: '24px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '42px', marginBottom: '8px' }}>🔐</div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px', color: '#0f172a' }}>Secret Access</h2>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px' }}>Access pete PIN enter korun</p>

        <form onSubmit={handlePinSubmit}>
          <input
            type="password"
            maxLength={6}
            placeholder="PIN (Default: 1234)"
            value={pinInput}
            onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
            style={{ width: '100%', boxSizing: 'border-box', padding: '12px', textAlign: 'center', fontSize: '18px', letterSpacing: '4px', borderRadius: '8px', border: pinError ? '1px solid #ef4444' : '1px solid #cbd5e1', marginBottom: '12px' }}
          />
          {pinError && <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>Bhul PIN code!</div>}
          <button type="submit" style={{ width: '100%', padding: '11px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Enter
          </button>
        </form>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', padding: '0 14px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '14px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>⚙️ Hub Cart Manager (tbcadsa)</h2>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>● Database Connected</span>
        </div>
        <Link href="/" style={{ textDecoration: 'none', background: '#f1f5f9', color: '#0f172a', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
          Live Store ↗
        </Link>
      </div>

      {/* Add Product Form */}
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px', color: '#0f172a' }}>+ Notun Product Add Korun</h3>

        <form onSubmit={handleAddProduct}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Product-er Name *</label>
            <input required type="text" placeholder="Jemon: Android Permanent Root" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Price (BDT) *</label>
              <input required type="number" placeholder="250" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Image URL (Direct link) *</label>
              <input required type="url" placeholder="https://i.postimg.cc/.../image.png" value={image} onChange={(e) => setImage(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Original Price (Kata daag-er jonno)</label>
              <input type="number" placeholder="300 (Optional)" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Description</label>
            <textarea rows={2} placeholder="Service-er details..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
          </div>

          <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
            {submitting ? 'Add hocche...' : 'Add Product'}
          </button>
        </form>
      </div>

      {/* Product List and Delete */}
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#0f172a' }}>Current Products ({products.length})</h3>
          <button onClick={fetchProducts} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>🔄 Refresh</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Kono product add kora hoyni. Uporer form theke add korun.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {products.map((prod) => (
              <div key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', border: '1px solid #f1f5f9', borderRadius: '10px', background: '#f8fafc' }}>
                <img src={prod.image} alt={prod.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>{prod.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Category: {prod.category} | ৳{prod.price}</div>
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
