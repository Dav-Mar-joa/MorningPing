import React, { useState } from 'react';
import './styles/Home.css';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://morningping.onrender.com";

const AddEvent = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventFrequence, setEventFrequence] = useState("Anniv'");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = {
      event: eventName,
      date: eventDate,
      frequence: eventFrequence,
    };

    try {
      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // ← JWT
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEventName('');
        setEventDate('');
        setEventFrequence("Anniv'");
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
          <button className='btn'>← Liste</button>
        </Link>
      </div>
      <h1>⏰ Morning Ping</h1>
      <br/>
      <br/>
      <div className="postit-list">
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
          type="text"
          placeholder="Date (jj/mm/aaaa)"
          className="imputAddEvent"
          value={eventDate}
          onFocus={(e) => e.target.type = 'date'}
          onBlur={(e) => {
            if (!e.target.value) e.target.type = 'text';
          }}
          onChange={(e) => setEventDate(e.target.value)}
        />
        <select
          id="frequence"
          className="imputAddEvent"
          value={eventFrequence}
          onChange={(e) => setEventFrequence(e.target.value)}
        >
          <option value="Anniv'">Anniversaire</option>
          <option value="Annuel">Annuel</option>
          <option value="Hebdo">Hebdomadaire</option>
          <option value="Quotidien">Quotidien</option>
        </select>
        <button onClick={handleSubmit} className="btn">
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default AddEvent;