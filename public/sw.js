// Minimal no-op service worker — exists solely to satisfy Chrome/Android's
// PWA installability check (which requires a registered service worker).
// It deliberately caches nothing and never serves a cached response, so it
// can never hand out stale JS/CSS/HTML — every request still goes to the
// network exactly as if no service worker were installed.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => event.respondWith(fetch(event.request)));
