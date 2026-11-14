// Small, dependency-free field validators. Each returns an error string, or
// `null` if the value is valid. Composing them is just `const err = validateX(v);`.
//
// Kept intentionally conservative — Supabase enforces its own password & email
// rules server-side; this is the first line of feedback so users don't round-trip.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value) {
  const v = (value ?? '').trim();
  if (!v) return 'Email is required.';
  if (v.length > 254) return 'Email is too long.';
  if (!EMAIL_RE.test(v)) return 'Enter a valid email address.';
  return null;
}

export function validatePassword(value, { context = 'signup' } = {}) {
  const v = value ?? '';
  if (!v) return 'Password is required.';
  // For sign-in we only check presence — the server tells us if it's wrong.
  if (context === 'signin') return null;
  if (v.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Za-z]/.test(v)) return 'Password must include a letter.';
  if (!/[0-9]/.test(v)) return 'Password must include a number.';
  return null;
}

export function validateFullName(value) {
  const v = (value ?? '').trim();
  if (!v) return 'Full name is required.';
  if (v.length < 2) return 'Full name is too short.';
  if (v.length > 80) return 'Full name is too long.';
  return null;
}

export function validateTeamCode(value, { required = false } = {}) {
  const v = (value ?? '').trim();
  if (!v) return required ? 'Team code is required.' : null;
  if (v.length > 40) return 'Team code is too long.';
  if (!/^[A-Za-z0-9_\- ]+$/.test(v)) return 'Letters, numbers, dashes and underscores only.';
  return null;
}

export function validateOptionalText(value, { max = 80 } = {}) {
  const v = (value ?? '').trim();
  if (!v) return null;
  if (v.length > max) return `Keep it under ${max} characters.`;
  return null;
}
