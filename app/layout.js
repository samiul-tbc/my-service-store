import Link from 'next/link';
import Navbar from './Navbar';

export const metadata = {
  title: 'Hub Cart - Shop Smart • Live Better',
  description: 'Digital tools and services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body style={{ margin: 0, padding: 0, background: '#0b0f19', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        
        {/* ডায়নামিক হেডার */}
        <Navbar />

        {/* পেজের কনটেন্ট */}
        <div>{children}</div>

        {/* বটম ফ্লোটিং ডক (কার্টের পরিবর্তে Orders যুক্ত) */}
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'rgba(11, 15, 25, 0.88)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 100,
          maxWidth: '640px',
          margin: '0 auto'
        }}>
          <Link href="/" style={{ textDecoration: 'none', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <span style={{ fontSize: '10px', fontWeight: '700' }}>Home</span>
          </Link>

          <Link href="/categories" style={{ textDecoration: 'none', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span style={{ fontSize: '10px', fontWeight: '700' }}>Categories</span>
          </Link>

          {/* Cart এর পরিবর্তে Orders */}
          <Link href="/orders" style={{ textDecoration: 'none', textAlign: 'center', color: '#38bdf8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <span style={{ fontSize: '10px', fontWeight: '700' }}>Orders</span>
          </Link>

          <Link href="/profile" style={{ textDecoration: 'none', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span style={{ fontSize: '10px', fontWeight: '700' }}>Profile</span>
          </Link>
        </nav>

      </body>
    </html>
  );
}
