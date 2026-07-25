// Maison Heritage — Gestion des commandes (LocalStorage + API Laravel)

import * as api from './api';

const ORDERS_KEY = 'maison_heritage_orders';

export const ORDER_STATUS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(ORDERS_KEY);
    return [];
  }
};

export const saveOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const createOrder = ({ items, total, customerNote = '' }) => {
  const orders = getStoredOrders();
  const order = {
    id: `CMD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
    items: items.map(({ id, name, category, price, quantity, imageUrl }) => ({
      id,
      name,
      category,
      price: price || 0,
      quantity,
      imageUrl: imageUrl || '',
    })),
    total: total || 0,
    customerNote: customerNote || '',
  };
  orders.unshift(order);
  saveOrders(orders);
  return order;
};

export const updateOrderStatus = (orderId, status) => {
  const orders = getStoredOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return null;
  orders[index] = { ...orders[index], status, updatedAt: new Date().toISOString() };
  saveOrders(orders);
  return orders[index];
};

export const deleteOrder = (orderId) => {
  const filtered = getStoredOrders().filter(o => o.id !== orderId);
  saveOrders(filtered);
  return true;
};

export const getOrderStats = (products = []) => {
  const orders = getStoredOrders();
  const delivered = orders.filter(o => o.status === 'delivered');
  const pending = orders.filter(o => o.status === 'pending');
  const confirmed = orders.filter(o => o.status === 'confirmed');

  const revenueDelivered = delivered.reduce((sum, o) => sum + (o.total || 0), 0);
  const revenuePending = [...pending, ...confirmed].reduce((sum, o) => sum + (o.total || 0), 0);
  const inventoryValue = products.reduce((sum, p) => sum + (p.price > 0 ? p.price : 0), 0);

  return {
    totalOrders: orders.length,
    pendingCount: pending.length,
    confirmedCount: confirmed.length,
    deliveredCount: delivered.length,
    revenueDelivered,
    revenuePending,
    inventoryValue,
    productCount: products.length,
    featuredCount: products.filter(p => p.isFeatured).length,
  };
};

// ── API Laravel (avec fallback localStorage) ───────────────────

export async function loadOrders() {
  try {
    if (await api.isApiAvailable() && api.getToken()) {
      return await api.getOrders();
    }
  } catch (err) {
    console.warn('[Maison Heritage] API commandes indisponible — mode local.', err);
  }
  return getStoredOrders();
}

export async function submitOrder(data) {
  try {
    if (await api.isApiAvailable()) {
      return await api.createOrderApi(data);
    }
  } catch (err) {
    console.warn('[Maison Heritage] Enregistrement commande API échoué — mode local.', err);
  }
  return createOrder(data);
}

export async function persistOrderStatus(orderId, status) {
  if (await api.isApiAvailable() && api.getToken()) {
    return api.updateOrderStatusApi(orderId, status);
  }
  return updateOrderStatus(orderId, status);
}

export async function removeOrder(orderId) {
  if (await api.isApiAvailable() && api.getToken()) {
    await api.deleteOrderApi(orderId);
    return true;
  }
  return deleteOrder(orderId);
}

export async function loadStats(products = []) {
  try {
    if (await api.isApiAvailable() && api.getToken()) {
      return await api.getStats();
    }
  } catch (err) {
    console.warn('[Maison Heritage] API stats indisponible — calcul local.', err);
  }
  return getOrderStats(products);
}
