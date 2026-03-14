import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Home.css';

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://morningping.onrender.com";

const Forgot = () => {
  const [mode, setMode] = useState(null); // 'login' ou 'password'

  // Login oublié
  const [email, setEmail] = useState('');
  const [foundPseudo, setFoundPseudo] = useState('');

  // Mot de passe oublié
  const [pseudo, setPseudo] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [error, setError] = useState('');

  const handleForgotLogin = async (e) => {
    e.preventDefault();
    setError('');
    setFoundPseudo('');
    try {
      const res = await fetch(`${API_URL}/forgot-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setFoundPseudo(data.pseudo);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur réseau');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!pseudo || !newPassword || !confirmPassword) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudo, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Mot de passe mis à jour ! Tu peux te reconnecter.');
      } else {
        setError(data.message);
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

        {/* Choix initial */}
        {!mode && (
          <>
            <button className="btn" onClick={() => setMode('login')}>
              J'ai oublié mon login
            </button>
            <button className="btn" style={{ marginTop: '0.5rem' }} onClick={() => setMode('password')}>
              J'ai oublié mon mot de passe
            </button>
          </>
        )}

        {/* Login oublié */}
        {mode === 'login' && (
          <>
            <p style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Entre ton email pour retrouver ton login</p>
            <input
              type="email"
              placeholder="Email"
              className="imputAddEvent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {foundPseudo && (
              <p style={{ color: 'green', textAlign: 'center' }}>
                Ton login est : <strong>{foundPseudo}</strong>
              </p>
            )}
            <button onClick={handleForgotLogin} className="btn" style={{ marginTop: '0.5rem' }}>
              Retrouver mon login
            </button>
            <button className="btn" style={{ marginTop: '0.5rem', background: 'transparent', color: '#888' }} onClick={() => { setMode(null); setError(''); setFoundPseudo(''); }}>
              ← Retour
            </button>
          </>
        )}

        {/* Mot de passe oublié */}
        {mode === 'password' && (
          <>
            <p style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Entre ton login et ton nouveau mot de passe</p>
            <input
              type="text"
              placeholder="Login"
              className="imputAddEvent"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              className="imputAddEvent"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              className="imputAddEvent"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMsg && <p style={{ color: 'green', textAlign: 'center' }}>{successMsg}</p>}
            <button onClick={handleForgotPassword} className="btn" style={{ marginTop: '0.5rem' }}>
              Changer mon mot de passe
            </button>
            <button className="btn" style={{ marginTop: '0.5rem', background: 'transparent', color: '#000000' }} onClick={() => { setMode(null); setError(''); setSuccessMsg(''); }}>
              ← Retour
            </button>
          </>
        )}

        <Link to="/login" className="btn" style={{ marginTop: '1rem', textAlign: 'center', display: 'block', background: 'transparent', color: '#000000', fontSize: '0.85rem' }}>
          ← Retour à la connexion
        </Link>
      </div>
    </div>
  );
};

export default Forgot;