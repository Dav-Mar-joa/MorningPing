const mongoose = require('mongoose');

// Modèle User simple (tu peux ajouter pseudo, email, mdp plus tard)
const userSchema = new mongoose.Schema({
  pseudo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  // autres champs possibles : theme, dateInscription, etc.
});

const User = mongoose.model('User', userSchema);


// Modèle Event avec référence à User
const eventSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: String, required: true },
  date: { type: Date, default: Date.now },
  frequence: { type: String, enum: ["Anniv'",'Annuel', 'Hebdo', 'Quotidien'], default: "Anniv'" },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = { User, Event };
