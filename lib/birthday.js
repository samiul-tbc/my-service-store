// Birthday card link codec — the whole card lives inside the link itself
// (base64url-encoded JSON), so no database row is needed to render it.
// Data shape: { name, birth, age, msg, from, photo, theme } — rendered by public/wish.html

export function encodeBirthday(data) {
  const bytes = new TextEncoder().encode(JSON.stringify(data || {}));
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeBirthday(str) {
  try {
    if (!str) return null;
    const b64 = String(str).replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes));
    if (!data || typeof data !== 'object' || !data.name) return null;
    return {
      name: String(data.name).slice(0, 60),
      birth: /^\d{4}-\d{2}-\d{2}$/.test(data.birth || '') ? data.birth : '',
      age: data.age ? String(data.age).slice(0, 3) : '',
      msg: data.msg ? String(data.msg).slice(0, 900) : '',
      from: data.from ? String(data.from).slice(0, 60) : '',
      photo: /^https?:\/\//i.test(data.photo || '') ? String(data.photo).slice(0, 500) : '',
      theme: ['midnight', 'candy', 'ocean'].includes(data.theme) ? data.theme : 'midnight',
    };
  } catch {
    return null;
  }
}

export function birthdayPath(data) {
  return `/wish.html?d=${encodeBirthday(data)}`;
}

export const BIRTHDAY_SITE = 'https://hubcart.vercel.app';
