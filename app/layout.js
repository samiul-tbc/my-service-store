import Link from 'next/link';

export const metadata = {
  title: 'Hub Cart - Shop Smart • Live Better',
  description: 'Digital tools and services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body style={{ margin: 0, padding: 0, background: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        
        {/* টপ হেডার (সব পেজে থাকবে) */}
        <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <img src="https://i.postimg.cc/4Y3TK6bN/5707.png" alt="Hub Cart" style={{ width: '34px', height: '34px', objectFit: 'contain', borderRadius: '8px' }} />
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#0f172a' }}>Hub Cart</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link href="/categories" style={{ textDecoration: 'none', fontSize: '20px', color: '#64748b' }}>🔍</Link>
            <Link href="/cart" style={{ textDecoration: 'none', fontSize: '22px', color: '#64748b' }}>🛒</Link>
            <Link href="/login" style={{ textDecoration: 'none', background: '#4f46e5', color: '#ffffff', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' }}>
              Login
            </Link>
          </div>
        </header>

        {/* পেজের মূল কনটেন্ট */}
        <div style={{ paddingBottom: '75px' }}>
          {children}
        </div>

        {/* ফ্লোটিং বটম বার (সব পেজে থাকবে) */}
        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '62px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100 }}>
          <Link href="/" style={{ textDecoration: 'none', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '20px' }}>🏠</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Home</span>
          </Link>

          <Link href="/categories" style={{ textDecoration: 'none', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '20px' }}>▦</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Categories</span>
          </Link>

          <Link href="/cart" style={{ textDecoration: 'none', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '20px' }}>🛒</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Cart</span>
          </Link>

          <Link href="/profile" style={{ textDecoration: 'none', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '20px' }}>👤</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Profile</span>
          </Link>
        </nav>

      </body>
    </html>
  );
}
