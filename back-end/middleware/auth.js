const jwt = require('jsonwebtoken');
require('dotenv').config(); // ← ajoute ça !
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

function isAuthenticated(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Non authentifié' });
  try {
    const token = auth.split(' ')[1];
    console.log('SECRET dans middleware:', JWT_SECRET); // ← vérifie
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch(err) {
    console.log('ERREUR JWT:', err.message);
    res.status(401).json({ message: 'Token invalide' });
  }
}

module.exports = isAuthenticated;