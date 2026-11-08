import './globals.css';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Footer from './Footer';
import { LanguageProvider } from '../context/LanguageContext';
import SwRegister from '../components/SwRegister';
import PwaBanner from '../components/PwaBanner';

export const metadata = {
  title: 'Hub Cart - Shop Smart • Live Better',
  description: 'Digital tools and services',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Hub Cart' },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport = {
  themeColor: '#080b10',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body style={{ margin: 0, padding: 0, background: '#080b10', color: '#f8fafc', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
        <LanguageProvider>
          {/* ডায়নামিক হেডার */}
          <Navbar />

          {/* পেজের কনটেন্ট */}
          <div>{children}</div>

          <Footer />

          {/* বটম ফ্লোটিং ডক (ডায়নামিক ভাষা ও অ্যাক্টিভ কালার সহ) */}
          <BottomNav />
          <SwRegister />
          <PwaBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
