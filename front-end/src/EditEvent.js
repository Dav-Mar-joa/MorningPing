import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/Home.css';

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://morningping.onrender.com";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({ nom: '', date: '', frequence: "Anniv'" });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      const dateFormatee = data.date ? new Date(data.date).toISOString().split('T')[0] : '';
      setEventData({ nom: data.event, date: dateFormatee, frequence: data.frequence });
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(eventData),
    });
    navigate('/');
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/');
  };

  return (
    <div className='home-container'>
      <div className='boutons'>
        <button className='btn' onClick={() => navigate('/')}>
          ← Retour
        </button>
      </div>
      <h1>⏰ Morning Ping 🔔</h1>
      <br/>
      <div className="postit-list">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '0.2rem' }}>
          <label className="form-label">Événement</label>
          <input
            className="imputAddEvent"
            type="text"
            name="nom"
            value={eventData.nom}
            onChange={handleChange}
          />
          <label className="form-label">Date</label>
          <input
            className="imputAddEvent"
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
          />
          <label className="form-label">Fréquence</label>
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
          <div className='EnregistrerDel' style={{ marginTop: '1.5rem' }}>
            <button className='btn' onClick={handleSubmit}>💾</button>
            <button className='btn-del' onClick={handleDelete}>🗑️</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;