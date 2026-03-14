import React, { useEffect, useState } from 'react';
import AnniversaireCard from './AnniversaireCard';
import './styles/Home.css';
import { Link } from 'react-router-dom';
import { subscribeUser } from './utils/subscribeUser';

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://morningping.onrender.com";

const Home = ({ user, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [filtreFrequence, setFiltreFrequence] = useState('');
  const [notifEnabled, setNotifEnabled] = useState(
    () => localStorage.getItem('notifEnabled') === 'true' // ← lit le localStorage dès le départ
  );

  useEffect(() => {
    fetch(`${API_URL}/`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEvents(data);
        else setEvents([]);
      })
      .catch(err => console.error('Erreur fetch:', err));

    // Vérifie l'état réel du navigateur au montage
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          const enabled = !!(subscription && Notification.permission === 'granted');
          setNotifEnabled(enabled);
          localStorage.setItem('notifEnabled', enabled); // ← synchronise le localStorage
        });
      });
    }
  }, []);

  const eventsFiltres = filtreFrequence
    ? events.filter(event => event.frequence === filtreFrequence)
    : events;

  const handleActiverNotifs = async () => {
    await subscribeUser();
    if (Notification.permission === 'granted') {
      setNotifEnabled(true);
      localStorage.setItem('notifEnabled', 'true'); // ← sauvegarde
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' });
    localStorage.removeItem('notifEnabled'); // ← nettoie à la déco
    onLogout();
  };

  return (
    <div className='home-container'>
      <div className='boutons'>
        <Link to="/AddEvent">
          <button className='btn'>➕ Event</button>
        </Link>
        <button className='btn-logout' onClick={handleLogout}>
          <img src="/logout.png" alt="Déconnexion" style={{ width: '45px', height: '45px' }} />
        </button>
      </div>

      <h1>⏰ Morning Ping 🔔</h1>
      {user && <p style={{ color: '#5a3e00', margin: 0 }}>👋 {user}</p>}

      {!notifEnabled && (
        <button id="notif-button" className="btn" onClick={handleActiverNotifs}>
          🔔 Activer les notifications
        </button>
      )}

      <div className="filtre-container">
        <select
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