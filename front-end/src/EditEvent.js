import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://morningping.onrender.com";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({ nom: '', date: '', frequence: "Anniv'" });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      // Formate la date pour l'input type="date" (YYYY-MM-DD)
      const dateFormatee = data.date ? new Date(data.date).toISOString().split('T')[0] : '';
      setEventData({ nom: data.event, date: dateFormatee, frequence: data.frequence });
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(eventData),
    });
    navigate('/');
  };

  const handleDelete = async () => {
    // if (!window.confirm('Supprimer cet événement ?')) return;
    await fetch(`${API_URL}/api/events/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    navigate('/');
  };

  return (
    <div className='home-container'>
      <div className='boutons'>
        <button className='btn' type="button" onClick={() => navigate('/')}>
          ← Retour
        </button>
      </div>

      <h1>⏰ Morning Ping</h1>
      <br/>

      <div className="postit-list">
        <form onSubmit={handleSubmit}>

          <label>Événement :</label>
          <input
            className="imputAddEvent"
            type="text"
            name="nom"
            value={eventData.nom}
            onChange={handleChange}
          />

          <label>Date :</label>
          <input
            className="imputAddEvent"
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
          />

          <label>Fréquence :</label>
          <select
            name="frequence"
            className="imputAddEvent"
            value={eventData.frequence}
            onChange={handleChange}
          >
            <option value="Anniv'">Anniversaire</option>
            <option value="Annuel">Annuel</option>
            <option value="Hebdo">Hebdomadaire</option>
            <option value="Quotidien">Quotidien</option>
          </select>

          <div className='EnregistrerDel'>
            <button className='btn' type="submit">💾 Enregistrer</button>
            <button className='btn-del' type="button" onClick={handleDelete}>
              <img src="/delete.png" alt="Supprimer" style={{ width: '45px', height: '45px' }} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditEvent;