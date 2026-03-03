import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Home'; // Import the Home component
import AddEvent from './AddEvent';
import EditEvent from './EditEvent';

function App() {
  
  useEffect(() => {
    // Vérifie si le navigateur supporte service worker et Push API
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker enregistré', registration);

          // Vérifie si déjà abonné
          return registration.pushManager.getSubscription()
            .then(async subscription => {
              if (subscription) return subscription;

              // Clé VAPID publique de ton .env
              const publicVapidKey = 'BAsqhQPsfonVsL1vUwgYMtrH8KQoUpy2YeDjp46iZaAPAA86cDlUZPaFuLs_wE_HfIDvja0lQJ5crkxaWyF-YOs';
              return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
              });
            });
        })
        .then(subscription => {
          // Envoie la subscription au serveur pour la stocker en DB
          fetch('https://morningping.onrender.com/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: { 'Content-Type': 'application/json' }
          });
        })
        .catch(err => console.error('Erreur SW/Push:', err));
    }
  }, []);

  // Fonction utilitaire pour convertir la clé VAPID
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AddEvent" element={<AddEvent/>} />
        <Route path="/editEvent/:id" element={<EditEvent />} />
      </Routes>
    </Router>
  );
}

export default App;