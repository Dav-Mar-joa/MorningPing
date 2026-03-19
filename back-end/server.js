const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { User, Event } = require('./models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isAuthenticated = require('./middleware/auth');
const webpush = require('web-push');
const cors = require('cors');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

webpush.setVapidDetails(
  'mailto:david@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  endpoint: String,
  keys: { p256dh: String, auth: String }
});
const Subscription = mongoose.model('Subscription', subscriptionSchema);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://morningping-front.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1);

// ── AUTH ──────────────────────────────────────────

app.post('/register', async (req, res) => {
  const { pseudo, email, password } = req.body;
  try {
    if (!pseudo || !email || !password)
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    const existsPseudo = await User.findOne({ pseudo });
    if (existsPseudo) return res.status(400).json({ message: 'Ce login est déjà utilisé' });
    const existsEmail = await User.findOne({ email });
    if (existsEmail) return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    const passwordHash = await bcryptjs.hash(password, 10);
    const user = await User.create({ pseudo, email, passwordHash });
    const token = jwt.sign({ id: user._id, pseudo: user.pseudo }, JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ message: 'Compte créé', pseudo: user.pseudo, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/login', async (req, res) => {
  const { pseudo, password } = req.body;
  try {
    const user = await User.findOne({ pseudo });
    if (!user) return res.status(401).json({ message: 'Login ou mot de passe incorrect' });
    const valid = await bcryptjs.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Login ou mot de passe incorrect' });
    const token = jwt.sign({ id: user._id, pseudo: user.pseudo }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ message: 'Connecté', pseudo: user.pseudo, token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/forgot-login', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Aucun compte avec cet email' });
    res.json({ pseudo: user.pseudo });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/forgot-password', async (req, res) => {
  const { pseudo, newPassword } = req.body;
  try {
    const user = await User.findOne({ pseudo });
    if (!user) return res.status(404).json({ message: 'Login introuvable' });
    const passwordHash = await bcryptjs.hash(newPassword, 10);
    await User.updateOne({ pseudo }, { passwordHash });
    res.json({ message: 'Mot de passe mis à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/logout', (req, res) => {
  res.json({ message: 'Déconnecté' });
});

app.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Non connecté' });
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ id: decoded.id, pseudo: decoded.pseudo });
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
});

// ── PUSH ─────────────────────────────────────────

app.post('/subscribe', async (req, res) => {
  const sub = req.body;
  const auth = req.headers.authorization;
  let userId = null;
  if (auth) {
    try {
      const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
      userId = decoded.id;
    } catch {}
  }
  try {
    const exists = await Subscription.findOne({ endpoint: sub.endpoint });
    if (!exists) {
      await Subscription.create({ ...sub, userId });
    } else if (userId && !exists.userId) {
      await Subscription.updateOne({ endpoint: sub.endpoint }, { userId });
    }
    res.status(201).json({ message: 'Subscription saved' });
  } catch (err) {
    console.error('Erreur subscribe:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── EVENTS ───────────────────────────────────────

// app.get('/api/events', isAuthenticated, async (req, res) => {
//   try {
//     const events = await Event.find({ userId: req.user.id }).sort({ date: 1 });
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// });

app.get('/api/events', isAuthenticated, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id });
    
    // Tri par jour et mois uniquement (ignore l'année)
    events.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const moisJourA = dateA.getMonth() * 100 + dateA.getDate();
      const moisJourB = dateB.getMonth() * 100 + dateB.getDate();
      return moisJourA - moisJourB;
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post('/api/events', isAuthenticated, async (req, res) => {
  const { event, date, frequence } = req.body;
  if (!event) return res.status(400).json({ message: 'Le champ event est requis' });
  try {
    const newEvent = new Event({
      userId: req.user.id,
      event,
      date: date ? new Date(date) : Date.now(),
      frequence
    });
    await newEvent.save();
    res.json({ message: "Événement ajouté avec succès !" });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur lors de l\'ajout' });
  }
});

app.get('/api/events/:id', isAuthenticated, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: 'Événement non trouvé' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/events/:id', isAuthenticated, async (req, res) => {
  const { nom, date, frequence } = req.body;
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { event: nom, date, frequence },
      { new: true }
    );
    if (!updatedEvent) return res.status(404).json({ message: "Événement non trouvé" });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.delete('/api/events/:id', isAuthenticated, async (req, res) => {
  try {
    await Event.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Événement supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ── CRON ─────────────────────────────────────────

async function checkTodayEvents() {
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  const todayWeekDay = today.getDay();
  const events = await Event.find();

  for (const event of events) {
    const eventDate = new Date(event.date);
    const eventDay = eventDate.getDate();
    const eventMonth = eventDate.getMonth();
    const eventYear = eventDate.getFullYear();
    const eventWeekDay = eventDate.getDay();
    let shouldTrigger = false;
    let eventLabel = event.event;

    switch (event.frequence) {
      case "Quotidien": shouldTrigger = true; break;
      case "Hebdo": if (eventWeekDay === todayWeekDay) shouldTrigger = true; break;
      case "Annuel": if (eventDay === todayDay && eventMonth === todayMonth) shouldTrigger = true; break;
      case "Anniv'":
        const eventThisYear = new Date(todayYear, eventMonth, eventDay);
        const diffMs = eventThisYear - today;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
          shouldTrigger = true;
          eventLabel += ` (${todayYear - eventYear} ans) 🎂`;
        } else if (diffDays === 7) {
          shouldTrigger = true;
          eventLabel += ` dans 7 jours (${todayYear - eventYear} ans) ⏳`;
        }
        break;
    }

    if (shouldTrigger) {
      console.log("🔔 Rappel :", eventLabel);
      const subs = event.userId
        ? await Subscription.find({ userId: event.userId })
        : await Subscription.find();
      for (const sub of subs) {
        try {
          await webpush.sendNotification(sub, JSON.stringify({
            title: "⏰ Morning Ping",
            body: `${event.frequence} - ${eventLabel}`
          }));
        } catch (err) {
          if (err.statusCode === 410) await Subscription.deleteOne({ endpoint: sub.endpoint });
          console.error("Erreur push:", err.message);
        }
      }
    }
  }
}

app.get('/cron/update', async (req, res) => {
  if (req.query.secret !== process.env.CRON_SECRET) return res.status(403).send("Forbidden");
  try {
    console.log("✅ CRON exécuté !");
    await checkTodayEvents();
    res.status(200).send("✅ CRON OK");
  } catch (error) {
    console.error("❌ Erreur CRON:", error);
    res.status(500).send("❌ Erreur serveur");
  }
});

app.get('/wake', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));