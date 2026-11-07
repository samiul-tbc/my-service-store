// Dynamic sitemap: static pages + one entry per product.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';
const SITE_URL = 'https://hubcart.vercel.app';

export default async function sitemap() {
  const now = new Date();

  const staticPaths = [
    '/',
    '/categories',
    '/cart',
    '/track',
    '/orders',
    '/login',
    '/signup',
    '/privacy',
    '/terms',
    '/refund',
    '/faq',
  ];

  const routes = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const products = await res.json();
      if (Array.isArray(products)) {
        for (const p of products) {
          routes.push({
            url: `${SITE_URL}/product/${p.id}`,
            lastModified: now,
          });
        }
      }
    }
  } catch {
    // Products unreachable — return just the static routes.
  }

  return routes;
}
