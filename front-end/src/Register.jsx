import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Home.css';

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://morningping.onrender.com";

const Register = ({ onLogin }) => {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pseudo, password, confirmPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.pseudo);
      } else {
        setError(data.message || 'Erreur lors de la création');
      }
    } catch (err) {
      setError('Erreur réseau');
    }
  };

  return (
    <div className='home-container'>
      <h1>⏰ Morning Ping</h1>
      <br />
      <div className="postit-list">
        <input
          type="text"
          placeholder="Login"
          className="imputAddEvent"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="imputAddEvent"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          className="imputAddEvent"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleSubmit} className="btn">
          Créer mon compte
        </button>
        <Link to="/login">
          <button className="btn" style={{ marginTop: '0.5rem' }}>
            Déjà un compte ? Se connecter
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Register;