// Server component layout for product pages: per-product SEO metadata
// (Open Graph / Twitter) + schema.org Product JSON-LD.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mieygzqgoekinxppdepb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_niGVYwUfliF0u39aH2vOHQ_LEhuh6xP';
const SITE_URL = 'https://hubcart.vercel.app';

async function fetchProduct(id) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?id=eq.${encodeURIComponent(id)}&select=title,price,description,category`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

function cleanText(str) {
  return String(str || '').replace(/\s+/g, ' ').trim();
}

function metaDescription(product) {
  const desc = cleanText(product.description);
  if (desc) return desc.slice(0, 155);
  return `Buy ${product.title} at the best price in Bangladesh — ৳${product.price} only on Hub Cart.`;
}

export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.id);

  if (!product) {
    return {
      title: 'Hub Cart',
      description:
        'Buy digital services and subscriptions at the best price in Bangladesh — only on Hub Cart.',
    };
  }

  const title = `${product.title} — Hub Cart`;
  const description = metaDescription(product);
  const image = `${SITE_URL}/api/img/${params.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductLayout({ children, params }) {
  const product = await fetchProduct(params.id);

  let jsonLd = null;
  if (product) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      image: `${SITE_URL}/api/img/${params.id}`,
      description: metaDescription(product),
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BDT',
        price: product.price,
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/product/${params.id}`,
      },
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
