import { redirect } from 'next/navigation';

// The birthday card experience lives in the standalone source at
// public/wish.html (Samiul's original design, upgraded). This route
// simply forwards old /birthday?d=... links to it, keeping the payload.
export default function BirthdayRedirect({ searchParams }) {
  const d = searchParams?.d;
  redirect(d ? `/wish.html?d=${encodeURIComponent(d)}` : '/wish.html');
}
