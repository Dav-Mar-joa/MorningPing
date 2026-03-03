import React, { useEffect, useState } from 'react';
import AnniversaireCard from './AnniversaireCard';
import './styles/Home.css';
import { Link } from 'react-router-dom';
import { subscribeUser } from './utils/subscribeUser';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [filtreFrequence, setFiltreFrequence] = useState(''); // '' = pas de filtre

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

  // Appliquer le filtre sur la liste
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

      {!localStorage.getItem('notif-enabled') && (
        <button
          id="notif-button"
          className="btn"
          onClick={subscribeUser}
        >
          🔔 Activer les notifications
        </button>
      )}

      {/* Liste déroulante pour filtrer */}
      <div className="filtre-container">
        {/* <label htmlFor="filtreFrequence">Filtrer par fréquence :</label> */}
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

      {/* Liste filtrée des événements */}
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
