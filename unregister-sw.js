// Manual Service Worker Unregistration Script
// Copy this code to browser console and execute

if ('serviceWorker' in navigator) {
  // Unregister all service workers
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log('Unregistered service worker:', registration.scope);
    }
    
    // Clear all caches
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      console.log('All caches cleared');
      
      // Force reload
      window.location.reload();
    });
  });
} else {
  console.log('Service Workers not supported');
}
