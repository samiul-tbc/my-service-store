'use client';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div style={{ padding: '16px 14px' }}>
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px 16px', textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontWeight: 'bold' }}>
          👤
        </div>
        <h3 style={{ fontSize: '17px', fontWeight: 'bold', margin: '0 0 4px', color: '#0f172a' }}>Guest User</h3>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px' }}>অ্যাকাউন্ট স্ট্যাটাস ও ওয়ালেট</p>
        <div style={{ display: 'inline-block', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
          ওয়ালেট ব্যালেন্স: ৳ 0.00
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Link href="/login" style={{ textDecoration: 'none', color: 'inherit', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>🔑 লগইন / সাইন-আপ</span>
          <span style={{ color: '#94a3b8' }}>→</span>
        </Link>
        <a href="https://t.me/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>💬 Telegram লাইভ সাপোর্ট</span>
          <span style={{ color: '#94a3b8' }}>→</span>
        </a>
        <a href="https://wa.me/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>🟢 WhatsApp হেল্পলাইন</span>
          <span style={{ color: '#94a3b8' }}>→</span>
        </a>
      </div>
    </div>
  );
}
