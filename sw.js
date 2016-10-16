var CACHE_NAME = 'webpub-viewer';
var urlsToCache = [
  '/webpub-manifest/examples/viewer/index.html',
  '/webpub-manifest/examples/viewer/sandbox.html',
  '/webpub-manifest/examples/viewer/viewer.js',
  '/webpub-manifest/examples/comics-viewer/index.html',
  '/webpub-manifest/examples/comics-viewer/viewer.js',
  '/webpub-manifest/fetch.js',
  '/webpub-manifest/urlsearchparams.js',
  '/webpub-manifest/webpub.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});


//This implements a network or cache strategy.
//It's a good balance between freshness and speed.
self.addEventListener('fetch', event => {
  event.respondWith(fromNetwork(event.request, 400).catch(function () {
    return caches.match(request);
  }));

});

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