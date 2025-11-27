import React, { useEffect, useState } from 'react';
import AnniversaireCard from './AnniversaireCard';
import './styles/Home.css';
import { Link } from 'react-router-dom';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

async function subscribeUser() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const register = await navigator.serviceWorker.register('/sw.js');

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BAsqhQPsfonVsL1vUwgYMtrH8KQoUpy2YeDjp46iZaAPAA86cDlUZPaFuLs_wE_HfIDvja0lQJ5crkxaWyF-YOs')
      });

      await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      });

      alert('✅ Notifications activées');
      localStorage.setItem('notif-enabled', 'true');
    } catch (e) {
      console.error('Erreur lors de la souscription aux notifications :', e);
      alert('Erreur lors de l’activation des notifications');
    }
  } else {
    alert('❌ Notifications non supportées');
  }
}

const Home = () => {
  const [events, setEvents] = useState([]);
  const [filtreFrequence, setFiltreFrequence] = useState('');

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://morningping.onrender.com";

  useEffect(() => {
    fetch(`${API_URL}/`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setEvents(data);
      })
      .catch(err => {
        console.error('Erreur lors du fetch des événements :', err);
      });
  }, []);

  // Supprimer le bouton si notifications déjà activées
  const notifEnabled = localStorage.getItem('notif-enabled') === 'true';

  const eventsFiltres = filtreFrequence
    ? events.filter(event => event.frequence === filtreFrequence)
    : events;

  return (
    <div className='home-container'>
      <div className='boutons'>
        <Link to="/AddEvent">
          <button className='btn'>➕ Event</button>
        </Link>
        <button className='btn-logout'>
          <img src="/logout.png" alt="Déconnexion" style={{ width: '45px', height: '45px' }} />
        </button>
      </div>

      <h1>⏰ Morning Ping 🔔</h1>

      {!notifEnabled && (
        <button onClick={subscribeUser} id="notif-button" className="btn">
          Activer notifications
        </button>
      )}

      <div className="filtre-container">
        <select
          id="filtreFrequence"
          value={filtreFrequence}
          onChange={(e) => setFiltreFrequence(e.target.value)}
          className="imputAddEvent"
        >
          <option value="">Toutes</option>
          <option value="Anniv'">Anniversaire</option>
          <option value="Annuel">Annuel</option>
          <option value="Hebdo">Hebdomadaire</option>
          <option value="Quotidien">Quotidien</option>
        </select>
      </div>

      <div className="postit-list">
        {eventsFiltres.map((event, index) => (
          <AnniversaireCard
            key={index}
            id={event._id}
            nom={event.event}
            date={new Date(event.date).toLocaleDateString('fr-FR')}
            frequence={event.frequence}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
