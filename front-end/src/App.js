import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './Home';
import AddEvent from './AddEvent';
import EditEvent from './EditEvent';
import Login from './Login';
import Register from './Register';

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:4000"
  : "https://morningping.onrender.com";

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifie si déjà connecté
    fetch(`${API_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setUser(data.pseudo);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Enregistre le service worker (sans demander la permission push automatiquement)
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker enregistré', registration);
        })
        .catch(err => console.error('Erreur SW:', err));
    }
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '1.5rem' }}>
      ⏳ Chargement...
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register onLogin={setUser} /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Home user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" />} />
        <Route path="/AddEvent" element={user ? <AddEvent /> : <Navigate to="/login" />} />
        <Route path="/editEvent/:id" element={user ? <EditEvent /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;