const CACHE_NAME = 'app-cache-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/login.html',
  '/style.css',
  '/app.js',
  '/login.js',
];

// Установка и кеширование ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_URLS))
  );
  self.skipWaiting();
});

// Активация и очистка старых кешей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Обработка fetch запросов
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Обновляем кеш
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          // Можно вернуть fallback страницу или сообщение
          return new Response(
            '<h1>Вы находитесь в офлайн-режиме</h1>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
      )
  );
});
