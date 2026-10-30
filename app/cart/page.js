'use client';
import Link from 'next/link';

export default function CartPage() {
  return (
    <div style={{ padding: '20px 14px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '14px' }}>আপনার শপিং কার্ট</h2>
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🛒</div>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 6px' }}>কার্ট খালি রয়েছে</h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px' }}>হোমপেজ থেকে যেকোনো সার্ভিস সিলেক্ট করে অর্ডার করুন।</p>
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', padding: '10px 22px', background: '#2563eb', color: '#fff', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' }}>
          প্রোডাক্ট দেখুন
        </Link>
      </div>
    </div>
  );
}
