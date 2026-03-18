import React, { useEffect, useState } from 'react';
import AnniversaireCard from './AnniversaireCard';
import './styles/Home.css';
import { Link, useLocation } from 'react-router-dom';
import { subscribeUser } from './utils/subscribeUser';

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://morningping.onrender.com";

const Home = ({ user, onLogout }) => {
  const [events, setEvents] = useState([]);
  const location = useLocation();
  const [filtreFrequence, setFiltreFrequence] = useState('');
  const [notifEnabled, setNotifEnabled] = useState(
    () => localStorage.getItem('notifEnabled') === 'true'
  );

  useEffect(() => {
    const token = localStorage.getItem('token'); // ← JWT

    fetch(`${API_URL}/api/events`, {
      headers: { Authorization: `Bearer ${token}` } // ← plus de credentials
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEvents(data);
        else setEvents([]);
      })
      .catch(err => console.error('Erreur fetch:', err));

    if (localStorage.getItem('notifEnabled') === 'true') return;

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          const enabled = !!(subscription && Notification.permission === 'granted');
          setNotifEnabled(enabled);
          localStorage.setItem('notifEnabled', String(enabled));
        });
      });
    }
  }, [location]);

  const eventsFiltres = filtreFrequence
    ? events.filter(event => event.frequence === filtreFrequence)
    : events;

  const handleActiverNotifs = async () => {
    await subscribeUser();
    if (Notification.permission === 'granted') {
      setNotifEnabled(true);
      localStorage.setItem('notifEnabled', 'true');
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('token'); // ← supprime le JWT
    localStorage.removeItem('notifEnabled');
    onLogout();
  };

  return (
    <div className='home-container'>
      {/* {user && <p style={{ color: '#5a3e00', margin: 0 , fontSize: '1.2rem'}}>👋 {user}</p>} */}
      <div className='boutons'>
        <Link to="/AddEvent">
          <button className='btn'>➕ Event</button>
        </Link>
        <button className='btn-logout' onClick={handleLogout}>
          <img src={process.env.PUBLIC_URL + '/logout.png'} alt="Déconnexion" style={{ width: '2rem', height: '2rem' }} />
        </button>
      </div>

      <h1>⏰ Morning Ping 🔔</h1>
      {/* {user && <p style={{ color: '#5a3e00', margin: 0 }}>👋 {user}</p>} */}

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