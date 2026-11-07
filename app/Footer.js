import Link from 'next/link';

const LOGO_HUB_CART = 'https://i.postimg.cc/ZRRgvqSQ/20261030-234214.png';
const SUPPORT_WHATSAPP = '8801319760720'; // app/orders ও product পেজে ব্যবহৃত সাপোর্ট নম্বর

const linkStyle = {
  display: 'block',
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: '12px',
  padding: '4px 0',
};

const headingStyle = {
  fontSize: '12px',
  fontWeight: '800',
  color: '#f8fafc',
  margin: '0 0 8px',
  letterSpacing: '0.4px',
  textTransform: 'uppercase',
};

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.075)',
        background: '#0a0e14',
        // fixed BottomNav যেন ফুটারের লেখা ঢেকে না ফেলে
        padding: '28px 20px 104px',
        marginTop: '40px',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '24px',
        }}
      >
        {/* ব্র্যান্ড */}
        <div>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <img src={LOGO_HUB_CART} alt="Hub Cart" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
            <span style={{ fontSize: '15px', fontWeight: '900', color: '#f8fafc' }}>Hub Cart</span>
          </Link>
          <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.7, color: '#64748b' }}>
            Shop Smart • Live Better. Premium digital services and everyday
            essentials, delivered simply and quickly.
          </p>
        </div>

        {/* দ্রুত লিংক */}
        <div>
          <h4 style={headingStyle}>Quick Links</h4>
          <Link href="/" style={linkStyle}>Home</Link>
          <Link href="/categories" style={linkStyle}>Categories</Link>
          <Link href="/cart" style={linkStyle}>Cart</Link>
          <Link href="/orders" style={linkStyle}>Track Order</Link>
          <Link href="/profile" style={linkStyle}>My Profile</Link>
        </div>

        {/* পলিসি */}
        <div>
          <h4 style={headingStyle}>Policies</h4>
          <Link href="/privacy" style={linkStyle}>Privacy Policy</Link>
          <Link href="/terms" style={linkStyle}>Terms of Service</Link>
          <Link href="/refund" style={linkStyle}>Refund Policy</Link>
          <Link href="/faq" style={linkStyle}>FAQ</Link>
        </div>

        {/* সাপোর্ট */}
        <div>
          <h4 style={headingStyle}>Support</h4>
          <a
            href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent('Hi Hub Cart, I need help with an order.')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...linkStyle, color: '#a6f36a', fontWeight: '700' }}
          >
            WhatsApp Support
          </a>
          <Link href="/orders" style={linkStyle}>Order Tracking</Link>
          <Link href="/faq" style={linkStyle}>Help / FAQ</Link>
          <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#64748b', lineHeight: 1.6 }}>
            অর্ডার সংক্রান্ত যেকোনো সমস্যায় WhatsApp-এ মেসেজ করুন — আপনার
            Order ID-টা সাথে রাখুন।
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1240px',
          margin: '24px auto 0',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '11px', color: '#64748b' }}>
          © {new Date().getFullYear()} Hub Cart. All rights reserved.
        </span>
        <span style={{ fontSize: '11px', color: '#64748b' }}>Shop Smart • Live Better</span>
      </div>
    </footer>
  );
}
