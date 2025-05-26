import React, { useState } from 'react';
import './styles/Home.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AddEvent = () => {
  // 1. Création des états pour mémoriser les valeurs des inputs
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
   const navigate = useNavigate();

  // 2. Fonction pour envoyer les données au backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Préparer les données à envoyer
    const data = {
      event: eventName,
      date: eventDate,
    };


    try {
      const API_URL =
        window.location.hostname === "localhost"
          ? "http://localhost:4000"
          : "https://morningping.onrender.com";
      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Succès, tu peux vider les inputs ou afficher un message
        setEventName('');
        setEventDate('');
        console.error('Événement ajouté avec succès !');
        navigate('/');

      } else {
        console.error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);

    }
  };

  return (
    <div className='home-container'>
      <div className='boutons'>
        <Link to="/">
          <button className='btn'>Liste</button>
        </Link>
        <button className='btn-logout'>
          <img src="/logout.png" alt="Déconnexion" style={{ width: '45px', height: '45px' }} />
        </button>
      </div>
      <h1>⏰ Morning Ping</h1>
      <div className="postit-list">
        {/* Inputs contrôlés avec onChange */}
        <input
          id="event"
          type="text"
          placeholder="Evenement"
          className="imputAddEvent"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <input
          id="date"
          type="date"
          placeholder="Date"
          className="imputAddEvent"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
        {/* Bouton pour envoyer */}
        <button onClick={handleSubmit} className="btn">
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default AddEvent;
