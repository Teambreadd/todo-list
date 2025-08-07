// Names the cache
const CACHE_NAME = "my-site-cache-v1";

// List of URLs to cache during the install event
const urlsToCache = [
    "./", // The root of the website
    "./index.html", // The html file
    "./style.css", // The css file
    "./app.js" // the js file
];

// Triggers when the service worker is installed (installed in app.js)
self.addEventListener("install", event => {
    // Waits until the caching of essential files are complete.
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // Adds all the specified files to the cache
            return cache.addAll(urlsToCache);
        })
    );
});

// This is triggered for every network request
self.addEventListener("fetch", event => {
    event.respondWith(
        // Checks if there is already a cache stored. 
        caches.match(event.request).then(response => {
            // Returns stored cache or fetches it from the internet. 
            return response || fetch(event.request);
        })
    );
});
