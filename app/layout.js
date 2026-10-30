export const metadata = {
  title: 'Service & Tools Store',
  description: 'Digital tools and services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
