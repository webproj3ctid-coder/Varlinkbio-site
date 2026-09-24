/* ═══════════════════════════════════════════════════════════════
   FIREBASE CLOUD MESSAGING SERVICE WORKER
   Varlinkbio — by Varoo
   ═══════════════════════════════════════════════════════════════ */

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCzEZCtXJTLOLVK3xvcpcUQEgSmwcmPXuQ",
  authDomain: "allweb-9dacd.firebaseapp.com",
  projectId: "allweb-9dacd",
  storageBucket: "allweb-9dacd.firebasestorage.app",
  messagingSenderId: "876830048672",
  appId: "1:876830048672:web:5795f72db6fa8e7a5324c5"
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(function(payload){
  console.log("[SW] Background message:", payload);
  
  const notificationTitle = (payload.notification && payload.notification.title) || 
    (payload.data && payload.data.title) || 
    "Varlinkbio";
  const notificationBody = (payload.notification && payload.notification.body) || 
    (payload.data && payload.data.body) || 
    "Cek notifikasi baru!";
  
  const notificationOptions = {
    body: notificationBody,
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230a0a0a'/><circle cx='50' cy='50' r='22' fill='%23ffd700' stroke='%23fff' stroke-width='4'/></svg>",
    badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230a0a0a'/><circle cx='50' cy='50' r='22' fill='%23ffd700'/></svg>",
    vibrate: [200, 100, 200],
    tag: "varlinkbio-notif",
    requireInteraction: false,
    data: {
      url: (payload.data && payload.data.link) || (payload.fcmOptions && payload.fcmOptions.link) || "/",
      dateOfArrival: Date.now()
    }
  };
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener("notificationclick", function(event){
  console.log("[SW] Notification click:", event);
  event.notification.close();
  
  const urlToOpen = (event.notification.data && event.notification.data.url) || "/";
  const fullUrl = urlToOpen.startsWith("http") ? urlToOpen : (self.location.origin + urlToOpen);
  
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList){
      // Kalau ada tab yang udah buka → focus & navigate
      for(let i=0; i<clientList.length; i++){
        const client = clientList[i];
        if(client.url === fullUrl && "focus" in client){
          return client.focus();
        }
      }
      // Kalau gak ada → buka tab baru
      if(clients.openWindow){
        return clients.openWindow(fullUrl);
      }
    })
  );
});
