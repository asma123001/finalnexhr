const API_BASE = window.NEXHR_API_BASE || (location.hostname.endsWith('github.io') ? 'https://finalnexhr.onrender.com/api' : '/api');
const inFlightMutations = new Map();

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

export function requireSession() {
  const token = getToken();
  if (!token) throw new Error('Your session expired. Please sign in again.');
  return token;
}

export async function api(path, options = {}) {
  const isLogin = path === '/auth/login';
  const token = isLogin ? getToken() : requireSession();
  const headers = { 'content-type': 'application/json', ...(options.headers || {}) };
  if (token) headers.authorization = `Bearer ${token}`;
  const method = String(options.method || 'GET').toUpperCase();
  const mutationKey = method === 'GET' ? '' : `${method} ${path} ${options.body || ''}`;
  if (mutationKey && inFlightMutations.has(mutationKey)) return inFlightMutations.get(mutationKey);
  const request = (async () => {
    const requestHeaders = { ...headers };
    if (mutationKey && !requestHeaders['x-idempotency-key']) requestHeaders['x-idempotency-key'] = stableRequestKey(mutationKey);
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers: requestHeaders });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = readApiError(data, res.status);
      if (res.status === 401) {
        clearSession();
        throw new Error(message === 'Missing bearer token' ? 'Your session expired. Please sign in again.' : message);
      }
      throw new Error(message);
    }
    return data;
  })();
  if (!mutationKey) return request;
  inFlightMutations.set(mutationKey, request);
  try {
    return await request;
  } finally {
    inFlightMutations.delete(mutationKey);
  }
}

function stableRequestKey(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  return `nexhr-${Date.now()}-${Math.abs(hash)}`;
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
