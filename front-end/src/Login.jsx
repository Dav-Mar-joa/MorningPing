import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Home.css';

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://morningping.onrender.com";

const Login = ({ onLogin }) => {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudo, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token); // ← sauvegarde le JWT
        onLogin(data.pseudo);
      } else {
        setError(data.message || 'Erreur de connexion');
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleSubmit} className="btn">
          Se connecter
        </button>
        <Link to="/register" className="btn" style={{ marginTop: '0.5rem', textAlign: 'center', display: 'block' }}>
          Créer un compte
        </Link>
        <Link to="/forgot" className="btn" style={{ marginTop: '0.5rem', textAlign: 'center', display: 'block', background: 'transparent', color: '#000000', fontSize: '1rem' }}>
          Login ou mot de passe oublié ?
        </Link>
      </div>
    </div>
  );
};

export default Login;
