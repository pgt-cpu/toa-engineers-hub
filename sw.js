/* Needed so alert messages work on Android. Do not rename. */
self.addEventListener("install",function(){self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(self.clients.claim())});
self.addEventListener("notificationclick",function(e){e.notification.close();e.waitUntil(self.clients.openWindow("./"))});
