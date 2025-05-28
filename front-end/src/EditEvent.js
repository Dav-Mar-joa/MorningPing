import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EditEvent = () => {
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const [eventData, setEventData] = useState({ nom: '', date: '',frequence: "" });
   const navigate = useNavigate();
  // Simuler une récupération de données (à remplacer par une vraie requête)
  useEffect(() => {
    const API_URL =
        window.location.hostname === "localhost"
          ? "http://localhost:4000"
          : "https://morningping.onrender.com";
    // Remplacer ceci par une requête à la base ou au backend
    const fetchData = async () => {
      // Exemple fictif
      const response = await fetch(`${API_URL}/api/events/${id}`);
      const data = await response.json();
      setEventData({ nom: data.event, date: data.date, frequence: data.frequence })
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const API_URL =
        window.location.hostname === "localhost"
          ? "http://localhost:4000"
          : "https://morningping.onrender.com";

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoie les modifications vers le backend
    fetch(`${API_URL}/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('Événement mis à jour', data);
      navigate('/');

      // Rediriger si besoin
    });
  };

  return (
    <div className='home-container'>
      <h1>⏰ Morning Ping</h1>
      <br/> 
      <br/> 
      <div className="postit-list">
        <form onSubmit={handleSubmit}>
          {/* <div className="imputAddEvent"> */}
            <label>
              Evenement :
              <input className="imputAddEvent" type="text" name="nom" value={eventData.nom} onChange={handleChange} />
            </label>
            <br />
            <label>
              Date à répeter:
              <input className="imputAddEvent" type="date" name="date" value={eventData.date} onChange={handleChange} />
            </label>
            <label>
              <br />
              Fréquence des notifications:
            </label>
            
            <select id="frequence" className="imputAddEvent" value={eventData.frequence} onChange={handleChange}>
                <option value="Anniv'">Anniversaire</option>
                <option value="Annuel">Annuel</option>
                <option value="Hebdo">Hebdomadaire</option>
                <option value="Quotidien">Quotidien</option>
        </select>
          {/* </div> */}
          <div className='EnregistrerDel'>
            <div className='boutons'>
              <button className ='btn' type="submit">Enregistrer</button>
            </div>
            <div className='boutons'>
              <button className ='btn-del' type="submit">
                <img src="/delete.png" alt="Supprimer" style={{ width: '45px', height: '45px' }} />
              </button>
            </div>
          </div>  
          <Link to="/">
          <div className='boutons'>
            <button className ='btn' type="submit">List</button>
          </div>
          </Link>
          
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
