/* v1.5.0 - Static SW for iOS compatibility */
const CACHE_NAME = 'asoc-v3';
const PRECACHE_URLS = [];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('firestore.googleapis.com')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});

self.addEventListener('push', (event) => {
  var title = 'Asociación Juvenil';
  var body = '';
  var url = '/asociacion-juvenil-pwa/';
  if (event.data) {
    try {
      var data = event.data.json();
      title = data.title || title;
      body = data.body || body;
      url = data.url || url;
    } catch (e) {}
  }
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: '/asociacion-juvenil-pwa/icons/icon-192.png',
      badge: '/asociacion-juvenil-pwa/icons/icon-192.png',
      data: { url: url },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  var url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/asociacion-juvenil-pwa/';
  event.waitUntil(clients.openWindow(url));
});
