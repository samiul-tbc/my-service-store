export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/tbcadsa', '/api/'],
    },
    sitemap: 'https://hubcart.vercel.app/sitemap.xml',
  };
}
