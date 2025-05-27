import React, { useEffect, useState } from 'react';
import AnniversaireCard from './AnniversaireCard';
import './styles/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:4000/', {
//       credentials: 'include' // si tu utilises des cookies (sessions)
//     })
//       .then(res => res.json())
//       .then(data => {
//         setEvents(data);
//       })
//       .catch(err => {
//         console.error('Erreur lors du fetch des événements :', err);
//       });
//   }, []);
    const [events, setEvents] = useState([]);
      const API_URL =
        window.location.hostname === "localhost"
          ? "http://localhost:4000"
          : "https://morningping.onrender.com";
    useEffect(() => {
    fetch(`${API_URL}/`, {
      credentials: 'include' // si tu utilises des cookies (sessions)
    })
      .then(res => res.json())
      .then(data => {
        setEvents(data);
      })
      .catch(err => {
        console.error('Erreur lors du fetch des événements :', err);
      });
    },[])
  return (
    <div className='home-container'>
      <div className='boutons'>
        <Link to="/AddEvent">
          <button className='btn'> ➕ event</button>
        </Link>
        <button className='btn-logout'>
          <img src="/logout.png" alt="Déconnexion" style={{ width: '45px', height: '45px' }} />
        </button>
      </div>
      <h1>⏰ Morning Ping 🔔</h1>
      <div className="postit-list">
        {events.map((event, index) => (
          <AnniversaireCard
            key={index}
            id={event._id}
            nom={event.event} // ou event.nom si ton modèle a un champ nom
            date={new Date(event.date).toLocaleDateString('fr-FR')}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
