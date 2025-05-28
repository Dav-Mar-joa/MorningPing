// self.addEventListener('push', event => {
//   const data = event.data.json();
//   self.registration.showNotification(data.title, {
//     body: data.body,
//     icon: '/assets/logo192.png', // ton icône
//     tag: 'rappel-anniversaire'
//   });
// });


self.addEventListener('push', function (event) {
  const data = event.data.json();
  const title = data.title || "🎉 Notification !";
  const options = {
    body: data.body || "Tu as un rappel ou un anniversaire !",
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'close',
        title: 'Fermer',
      }
    ]
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
