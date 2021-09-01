function precache(){return caches.open(CACHE).then(function(e){return e.addAll(["index.html","style.css","script.js","favicon.ico","assets/icons/favicon.ico","assets/icons/favicon48x48.ico","assets/icons/favicon128x128.ico","assets/textures/ui/icon_book_writable96x96.webp","assets/textures/ui/icon_sign96x96.webp","assets/icons/title.webp","assets/textures/book/book.png","assets/textures/ui/panorama_0.png","assets/textures/ui/panorama_1.png","assets/textures/ui/panorama_2.webp","assets/textures/ui/panorama_3.webp","assets/textures/ui/panorama_4.webp","assets/textures/ui/panorama_5.webp"])})}function fromNetwork(e,t){return new Promise(function(s,n){var r=setTimeout(n,t);fetch(e).then(function(e){clearTimeout(r),s(e)},n)})}function fromCache(e){return caches.open(CACHE).then(function(t){return t.match(e).then(function(e){return e||Promise.reject("no-match")})})}function update(e){return caches.open(CACHE).then(function(t){return fetch(e).then(function(s){return t.put(e,s)})})}var CACHE="rhcwiki-network-or-cache";self.addEventListener("install",function(e){console.log("The service worker is being installed."),self.skipWaiting(),e.waitUntil(precache())}),self.addEventListener("fetch",function(e){"GET"===e.request.method&&e.request.url.startsWith("http://localhost")&&e.request.url.startsWith("https://localhost")&&e.request.url.startsWith("https://rhc-wiki.web.app/")&&e.request.url.startsWith("https://www.gstatic.com/")&&(console.log(["The service worker is serving the asset.",e.request]),e.respondWith(fromNetwork(e.request,400).catch(function(){return fromCache(e.request).catch(()=>{fromNetwork(e.request,1e5)})})),e.waitUntil(update(e.request)))});