// Basic service worker setup for SnapStack PWA
self.addEventListener("install", (event) => {
    console.log("Service Worker installed for SnapStack.");
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activated for SnapStack.");
});

// Intercept fetch requests (empty handler for now)
self.addEventListener("fetch", (event) => {
    // This can be extended with caching logic if needed
});
