// Birthday card link codec — the whole card lives inside the link itself
// (base64url-encoded JSON), so no database row is needed to render it.
// Data shape: { name, age, msg, from, theme }

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
      age: data.age ? String(data.age).slice(0, 3) : '',
      msg: data.msg ? String(data.msg).slice(0, 400) : '',
      from: data.from ? String(data.from).slice(0, 60) : '',
      theme: ['midnight', 'candy', 'ocean'].includes(data.theme) ? data.theme : 'midnight',
    };
  } catch {
    return null;
  }
}

export function birthdayPath(data) {
  return `/birthday?d=${encodeBirthday(data)}`;
}

export const BIRTHDAY_SITE = 'https://hubcart.vercel.app';
