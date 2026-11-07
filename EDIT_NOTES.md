# Edit Notes — Hub Cart

## What was changed
- **app/page.js (Home page)** — Rewritten as a single-file, self-contained version.
  - The exact same UI as before: Notice bar, Hero, Benefits, Popular Picks
    product grid, loading skeleton, empty state, and footer note.
  - All `hc-` styles that were previously only in `app/globals.css` are now
    also included inside `page.js` itself (formatted / readable, not minified),
    so the home page UI works even on its own.
  - Responsive behaviour kept identical: product grid 4 columns (desktop),
    3 columns (≤900px), 2 columns (≤640px); benefits stack on mobile.
  - Product data and notice still load from `/api/products` — no API change.

## What was NOT changed
- Everything else is untouched from the original upload:
  all other pages (cart, categories, product, orders, track, login, signup,
  profile, payment — bkash / nagad / rocket / upay / crypto, invoice, admin),
  all API routes, Navbar, BottomNav, layout, globals.css, language
  context / translations, and package.json.

## Run it
```bash
npm install
npm run dev
# or for production:
npm run build && npm start
```

---

# v2 — Top bug fixes (after website review)

1. **Search fixed**
   - Navbar: the magnifier icon no longer links to `/orders`. It now opens a
     search bar; submitting goes to `/categories?q=<term>`.
   - Categories page: a permanent search box filters products live by title /
     category, and it also reads the `?q=` value coming from the navbar.
     A "no results" message is shown when nothing matches.
2. **Footer added** (`app/Footer.js`, rendered from `app/layout.js` on every page)
   - Brand, Quick Links (Home / Categories / Cart / Track Order / Profile),
     Policies, and WhatsApp Support (same support number used in orders/product pages).
   - Extra bottom padding so the fixed BottomNav never covers footer text.
3. **Policy & help pages added**
   - `/privacy`, `/terms`, `/refund`, `/faq` — built with the shared
     `components/PolicyPage.js` layout, written for this store (digital goods,
     WhatsApp ordering, order tracking, refund conditions).
4. **Empty categories hidden**
   - Categories with 0 products (e.g. Social Boost) are no longer shown once
     products have loaded. "All Services" is always shown.
5. **Forgot Password**
   - New `/forgot-password` page using Supabase Auth recovery
     (`POST /auth/v1/recover`), with a neutral "if an account exists…" message.
   - Login form (login mode) now has a "পাসওয়ার্ড ভুলে গেছেন?" link to it.
   - Note: for the reset email link to land back on your site, add your site
     URL in Supabase Dashboard → Authentication → URL Configuration.

## Verification
- `npm install` + `npm run build` — build succeeds; routes `/privacy`,
  `/terms`, `/refund`, `/faq`, `/forgot-password` all generate correctly.

---

# v3 — Full UI redesign (premium dark + lime, site-wide)

Design direction: the homepage already had a premium dark theme with a lime
accent (#a6f36a), while most other pages still used an older blue theme
(#2563eb / #38bdf8). The whole site now uses ONE design system.

## Theme unification (18 UI files)
- All blue primaries/accents → brand lime gradient `linear-gradient(135deg, #a6f36a, #d2ffad)`,
  price/accent colour `#38bdf8` → `#a6f36a`, blue glows/shadows → lime glows.
- Text on lime buttons/badges changed from white to dark `#10170c` for contrast.
- Applies to: Navbar, LanguageToggle, categories, product, cart, orders, track,
  confirm / confirm-order, payment, crypto-pay, order-success, invoice,
  login, signup, profile, forgot-password, and the admin page.

## Layout / shell redesign
- **Categories:** container 640px → 1100px; category grid and product grid are
  now responsive (`auto-fit / auto-fill`), product images taller (115px → 150px),
  bigger Manrope heading — desktop no longer shows a narrow mobile column.
- **Product page:** content width 600px → 760px.
- **BottomNav:** glass background + active item now has a lime pill highlight.
- **Payment gateway page:** was a light page inside a dark site — now dark
  themed, keeping the white brand cards so bKash/Nagad/Rocket/Upay logos stay
  readable. (The individual payment-method pages keep their official
  brand-instruction look on purpose.)
- **globals.css:** lime focus-visible rings and a themed scrollbar.

## NOT changed
- No logic changed: all Supabase/Auth/order/payment flows, API routes,
  routes/URLs and the v2 fixes (search, footer, policy pages, hidden empty
  categories, forgot password) work exactly as before.
- Homepage design itself was already the target look, so it is unchanged.

## Verification
- `npm install` + `npm run build` — succeeds with the redesign applied.

---

# Repo delivery note
This package is structured exactly like the GitHub repo
`samiul-tbc/my-service-store` (files at the root: app/, components/,
context/, lib/, package.json). It applies the v1 homepage, v2 bug fixes
and v3 redesign on top of the repo's current main branch.
To publish: copy these files into your repo, commit and push —
Vercel will redeploy hubcart.vercel.app automatically.
Note: the repo was missing `app/globals.css` (its old layout did not import
it); this package includes it because the new layout/homepage use it.
