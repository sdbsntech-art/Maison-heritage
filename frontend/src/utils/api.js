/**
 * Client API Laravel — Maison Heritage
 * Fallback automatique vers localStorage si l'API est hors ligne.
 */

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const TOKEN_KEY = 'mh_admin_token';

let apiAvailableCache = null;
let apiCheckPromise = null;

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || '';
}

export function setToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

export async function isApiAvailable(force = false) {
  if (!force && apiAvailableCache !== null) return apiAvailableCache;
  if (!force && apiCheckPromise) return apiCheckPromise;

  apiCheckPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${API_BASE}/health`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeout);
      apiAvailableCache = res.ok;
    } catch {
      apiAvailableCache = false;
    }
    apiCheckPromise = null;
    return apiAvailableCache;
  })();

  return apiCheckPromise;
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    setToken('');
    throw new Error('Session expirée. Reconnectez-vous.');
  }

  if (!res.ok) {
    let message = 'Erreur serveur';
    try {
      const data = await res.json();
      message = data.message || data.error || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ── Produits (public) ─────────────────────────────────────────
export const getProducts = () => request('/products');
export const createProduct = (data) => request('/products', { method: 'POST', body: JSON.stringify(data) });
export const updateProductApi = (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProductApi = (id) => request(`/products/${id}`, { method: 'DELETE' });

// ── Commandes ─────────────────────────────────────────────────
export const getOrders = () => request('/orders');
export const createOrderApi = (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) });
export const updateOrderStatusApi = (id, status) =>
  request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const deleteOrderApi = (id) => request(`/orders/${id}`, { method: 'DELETE' });
export const getStats = () => request('/stats');

// ── Auth admin ────────────────────────────────────────────────
export const adminLogin = (username, password) =>
  request('/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) });

export const adminLogout = () => request('/admin/logout', { method: 'POST' }).catch(() => null);

export const adminMe = () => request('/admin/me');

export function resetApiCache() {
  apiAvailableCache = null;
}
