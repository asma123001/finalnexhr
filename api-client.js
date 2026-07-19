const API_BASE = window.NEXHR_API_BASE || (location.hostname.endsWith('github.io') ? 'https://finalnexhr-api.onrender.com/api' : '/api');

function tokenKey() { return 'nexhr_token'; }

export function getToken() {
  return localStorage.getItem(tokenKey());
}

export function setSession(session) {
  localStorage.setItem(tokenKey(), session.token);
  localStorage.setItem('nexhr_user', JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem(tokenKey());
  localStorage.removeItem('nexhr_user');
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = { 'content-type': 'application/json', ...(options.headers || {}) };
  if (token) headers.authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(readApiError(data, res.status));
  return data;
}

function readApiError(data, status) {
  if (data && data.details && Array.isArray(data.details.fields) && data.details.fields[0]) {
    return data.details.fields[0].message || data.error || `Request failed (${status})`;
  }
  if (data && data.details && data.details.fieldErrors) {
    const first = Object.values(data.details.fieldErrors).flat().find(Boolean);
    if (first) return first;
  }
  return (data && data.error) || `Request failed (${status})`;
}

export async function login(email, password, role) {
  const session = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  });
  setSession(session);
  return session;
}

export function roleToApi(role) {
  return { super_admin: 'SUPER_ADMIN', org_admin: 'ORG_ADMIN', employee: 'EMPLOYEE' }[role] || role;
}

export function splitName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] || 'New', lastName: parts.slice(1).join(' ') || 'Employee' };
}
