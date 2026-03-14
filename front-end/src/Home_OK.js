import React, { useEffect, useState } from 'react';
import AnniversaireCard from './AnniversaireCard';
import './styles/Home.css';
import { Link } from 'react-router-dom';
import { subscribeUser } from './utils/subscribeUser';

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://morningping.onrender.com";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [filtreFrequence, setFiltreFrequence] = useState('');
  const [notifEnabled, setNotifEnabled] = useState(false); // ← CHANGÉ

  useEffect(() => {
    fetch(`${API_URL}/`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Erreur fetch:', err));

    // ← CHANGÉ : vérifie la vraie subscription navigateur, pas juste localStorage
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          if (subscription && Notification.permission === 'granted') {
            localStorage.setItem('notif-enabled', 'true');
            setNotifEnabled(true);
          } else {
            localStorage.removeItem('notif-enabled');
            setNotifEnabled(false);
          }
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
      localStorage.setItem('notif-enabled', 'true');
      setNotifEnabled(true);
    }
  };

  return (
    <div className='home-container'>
      <div className='boutons'>
        <Link to="/AddEvent">
          <button className='btn'>➕ Event</button>
        </Link>
        <button className='btn-logout'>
          <img src="/logout.png" alt="Déconnexion" style={{ width: '45px', height: '45px' }} />
        </button>
        {/* <button onClick={() => {
          localStorage.clear();
          alert('✅ LocalStorage vidé !');
          window.location.reload();
        }}>
          🗑️ Reset cache
        </button> */}
      </div>

      <h1>⏰ Morning Ping 🔔</h1>

      {!notifEnabled && (
        <button
          id="notif-button"
          className="btn"
          onClick={handleActiverNotifs}
        >
          🔔 Activer les notifications
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