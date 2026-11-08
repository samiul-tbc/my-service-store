'use client';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

const LOGO_HUB_CART = '/logo-icon.png';
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
  const { t } = useLanguage();
  return (
    <footer className="hc-footer"
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
            <img src="/logo-full.png" alt="Hub Cart" style={{ height: '36px', width: 'auto', display: 'block' }} />
          </Link>
          <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.7, color: '#64748b' }}>
            {t.footer.tagline}
          </p>
        </div>

        {/* দ্রুত লিংক */}
        <div>
          <h4 style={headingStyle}>{t.footer.quickLinks}</h4>
          <Link href="/" style={linkStyle}>{t.footer.home}</Link>
          <Link href="/categories" style={linkStyle}>{t.footer.categories}</Link>
          <Link href="/cart" style={linkStyle}>{t.footer.cart}</Link>
          <Link href="/orders" style={linkStyle}>{t.footer.trackOrder}</Link>
          <Link href="/guide" style={linkStyle}>{t.footer.guides}</Link>
          <Link href="/profile" style={linkStyle}>{t.footer.myProfile}</Link>
        </div>

        {/* পলিসি */}
        <div>
          <h4 style={headingStyle}>{t.footer.policies}</h4>
          <Link href="/privacy" style={linkStyle}>{t.footer.privacy}</Link>
          <Link href="/terms" style={linkStyle}>{t.footer.terms}</Link>
          <Link href="/refund" style={linkStyle}>{t.footer.refund}</Link>
          <Link href="/faq" style={linkStyle}>{t.footer.faq}</Link>
        </div>

        {/* সাপোর্ট */}
        <div>
          <h4 style={headingStyle}>{t.footer.support}</h4>
          <a
            href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(t.footer.whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...linkStyle, color: '#a6f36a', fontWeight: '700' }}
          >
            {t.footer.whatsappSupport}
          </a>
          <Link href="/orders" style={linkStyle}>{t.footer.orderTracking}</Link>
          <Link href="/faq" style={linkStyle}>{t.footer.helpFaq}</Link>
          <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#64748b', lineHeight: 1.6 }}>
            {t.footer.supportNote}
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
          © {new Date().getFullYear()} Hub Cart. {t.footer.rights}
        </span>
        <span style={{ fontSize: '11px', color: '#64748b' }}>{t.footer.slogan}</span>
      </div>
    </footer>
  );
}
