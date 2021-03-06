(
    () => {
        const cacheName = 'rates';
        const staticAssets = [
            './',
            './index.html',
            './app.js',
            './styles.css',
            './fallback.json',
            './favicon.ico',
            './images/android-chrome-192x192.png',
            './images/android-chrome-512x512.png',
            './images/apple-touch-icon.png',
            './images/favicon-16x16.png',
            './images/favicon-32x32.png',
            'https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css',
            'https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js',
            'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css'
        ];

        self.addEventListener('install', async function () {
            const cache = await caches.open(cacheName);
            cache.addAll(staticAssets);
        });

        self.addEventListener('activate', event => {
            event.waitUntil(self.clients.claim());
        });

        self.addEventListener('fetch', event => {
            const request = event.request;
            const url = new URL(request.url);
            if (url.origin === location.origin) {
                event.respondWith(cacheFirst(request));
            } else {
                event.respondWith(networkFirst(request));
            }
        });

        async function cacheFirst(request) {
            const cachedResponse = await caches.match(request);
            return cachedResponse || fetch(request);
        }

        async function networkFirst(request) {
            const dynamicCache = await caches.open('rates-dynamic');
            try {
                const networkResponse = await fetch(request);
                dynamicCache.put(request, networkResponse.clone());
                return networkResponse;
            } catch (err) {
                const cachedResponse = await dynamicCache.match(request);
                return cachedResponse || await caches.match('./fallback.json');
            }
        }
    }
)();