var CACHE = 'rhcwiki-network-or-cache';

// On install, cache some resource.
self.addEventListener('install', function (evt) {
    console.log('The service worker is being installed.');
    self.skipWaiting()
    // Ask the service worker to keep installing until the returning promise
    // resolves.
    evt.waitUntil(precache());
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function (evt) {
    if (evt.request.method !== 'GET' ||
        !evt.request.url.startsWith('http://localhost') ||
        !evt.request.url.startsWith('https://localhost') ||
        !evt.request.url.startsWith('https://rhc-wiki.web.app/') ||
        !evt.request.url.startsWith('https://www.gstatic.com/')) {
        return;
    }
    console.log(['The service worker is serving the asset.', evt.request]);
    // Try network and if it fails, go for the cached copy.
    evt.respondWith(fromNetwork(evt.request, 400).catch(function () {
        return fromCache(evt.request).catch(() => {
            fromNetwork(evt.request, 100000)
        });
    }));
    evt.waitUntil(update(evt.request))
});

// Open a cache and use `addAll()` with an array of assets to add all of them
// to the cache. Return a promise resolving when all the assets are added.
function precache() {
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll([
            'index.html',
            'style.css',
            'script.js',
            'favicon.ico',
            'assets/icons/favicon.ico',
            'assets/icons/favicon48x48.ico',
            'assets/icons/favicon128x128.ico',
            'assets/textures/ui/icon_book_writable96x96.webp',
            'assets/textures/ui/icon_sign96x96.webp',
            'assets/icons/title.webp',
            'assets/textures/book/book.png',
            'assets/textures/ui/panorama_0.png',
            'assets/textures/ui/panorama_1.png',
            'assets/textures/ui/panorama_2.webp',
            'assets/textures/ui/panorama_3.webp',
            'assets/textures/ui/panorama_4.webp',
            'assets/textures/ui/panorama_5.webp',
        ]);
    });
}

// Time limited network request. If the network fails or the response is not
// served before timeout, the promise is rejected.
function fromNetwork(request, timeout) {
    return new Promise(function (fulfill, reject) {
        // Reject in case of timeout.
        var timeoutId = setTimeout(reject, timeout);
        // Fulfill in case of success.
        fetch(request).then(function (response) {
            clearTimeout(timeoutId);
            fulfill(response);
            // Reject also if network fetch rejects.
        }, reject);
    });
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}

function update(request) {
    return caches.open(CACHE).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
}