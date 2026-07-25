// Service Worker — Maison Heritage PWA
// Strategy: Network-First (toujours chercher les données fraîches)
const CACHE_NAME = 'maison-heritage-v30';

// Install: pré-cache minimal, activation immédiate
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Activate: supprimer TOUS les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first strategy (pas de cache-first qui bloque les mises à jour)
self.addEventListener('fetch', (event) => {
  // Ne cache que les requêtes GET
  if (event.request.method !== 'GET') return;

  // Ne PAS intercepter les requêtes API
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cloner et mettre en cache la réponse fraîche
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback au cache uniquement si le réseau échoue
        return caches.match(event.request);
      })
  );
});
