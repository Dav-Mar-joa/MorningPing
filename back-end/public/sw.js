// Événement reçu quand une notification push arrive
self.addEventListener('push', function (event) {
  // Vérifie s'il y a des données et les parse
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    console.error("Erreur parsing JSON dans le push :", e);
  }

  const title = data.title || "🎉 Notification !";
  const options = {
    body: data.body || "Tu as un rappel ou un anniversaire !",
    icon: '/logo192.png',
    badge: '/logo72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/', // pour ouvrir une page spécifique
      ...data.extra // tout autre champ utile que tu veux passer
    },
    actions: [
      {
        action: 'open',
        title: 'Ouvrir',
      },
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

// Gère le clic sur la notification
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  // Selon l'action, on peut personnaliser
  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Si une fenêtre de l'app est déjà ouverte, on la focus
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Sinon, on ouvre une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
