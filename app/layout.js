import Navbar from './Navbar';
import BottomNav from './BottomNav';
import { LanguageProvider } from '../context/LanguageContext';

export const metadata = {
  title: 'Hub Cart - Shop Smart • Live Better',
  description: 'Digital tools and services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body style={{ margin: 0, padding: 0, background: '#0b0f19', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <LanguageProvider>
          {/* ডায়নামিক হেডার */}
          <Navbar />

          {/* পেজের কনটেন্ট */}
          <div>{children}</div>

          {/* বটম ফ্লোটিং ডক (ডায়নামিক ভাষা ও অ্যাক্টিভ কালার সহ) */}
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
