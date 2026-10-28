// R1 intentionally never caches API responses or claims offline API availability.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => new Response(
      '<h1>Mentor & Me</h1><p>You are offline. Reconnect and reload to continue.</p>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )));
  }
});
