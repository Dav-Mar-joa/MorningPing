const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const router = express.Router();
// const User = require('./models/user');
const { User, Event } = require('./models/user'); // adapte selon ton chemin
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcryptjs = require('bcryptjs');
const MongoStore = require('connect-mongo');
const isAuthenticated = require('./middleware/auth');
const {encrypt, decrypt, hashed} = require('./utils/cryptOutils')

dotenv.config();

const app = express();
app.use(cookieParser());

app.use((req, res, next) => {
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cors = require('cors');

app.use(cors({
  // origin: "https://morningping-front.onrender.com",
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1)

const sessionMiddleware = session({
    secret: process.env.JWT_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        dbName: 'MorningPing', 
        collectionName: 'production',
    }),
    cookie: {
        secure: false, // Mettre true en production avec HTTPS
        // httpOnly: true,
        // sameSite: 'None',
        maxAge: 30*24 * 60 * 60 * 1000, // Durée de vie des cookies (30 jour ici)
    },
});

app.use(sessionMiddleware);

let subscriptions = []; // ou en base de données

app.post('/subscribe', express.json(), (req, res) => {
  const sub = req.body;
  subscriptions.push(sub);
  res.status(201).json({});
});

console.log("date render", new Date().toLocaleString());

app.get('/', async (req, res) => {
  try {
    // console.log("/ dans /")
    const events = await Event.find().sort({ date: 1 }); // tri du plus récent au plus ancien
    // console.log("eventes", events);
    res.json(events);
  } catch (err) {
    console.error("Erreur lors de la récupération des événements :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post('/api/events', async (req, res) => {
  const { event, date, userId,frequence } = req.body;

  if (!event) {
    return res.status(400).json({ message: 'Le champ event est requis' });
  }
  // if (!userId) {
  //   return res.status(400).json({ message: 'Le champ userId est requis' });
  // }

  try {
    // Vérifie que l'utilisateur existe bien
    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({ message: 'Utilisateur non trouvé' });
    // }

    const newEvent = new Event({
      // userId,
      event,
      date: date ? new Date(date) : Date.now(),
      frequence
    });

    await newEvent.save();

    res.json({ message: "Événement ajouté avec succès !" });
  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'événement :', err);
    res.status(500).json({ message: 'Erreur serveur lors de l\'ajout' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    console.log("event", event);
    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    res.json(event);
  } catch (err) {
    console.error('Erreur lors de la récupération de l’événement :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.put('/api/events/:id', async (req, res) => {
  const { nom, date,frequence } = req.body;
  console.log("req.body", req.body);

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { event:nom, date,frequence },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    res.json(updatedEvent);
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


const connectDB = require('./config/db');
connectDB();

// app.get('/cron/update', async (req, res) => {
//   try {
//     console.log("✅ CRON exécuté !");
    
//     // 👉 Ton traitement ici
//     // ex: mise à jour DB, fetch API, etc.

//     res.status(200).send("✅ CRON OK");
//   } catch (error) {
//     console.error("❌ Erreur CRON:", error);
//     res.status(500).send("❌ Erreur serveur");
//   }
// });

async function checkTodayEvents() {
  const today = new Date();

  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayWeekDay = today.getDay(); // 0 = dimanche

  const events = await Event.find();

  for (const event of events) {
    const eventDate = new Date(event.date);

    const eventDay = eventDate.getDate();
    const eventMonth = eventDate.getMonth();
    const eventWeekDay = eventDate.getDay();

    let shouldTrigger = false;

    switch (event.frequence) {
      case "Quotidien":
        shouldTrigger = true;
        break;

      case "Hebdo":
        if (eventWeekDay === todayWeekDay) {
          shouldTrigger = true;
        }
        break;

      case "Mensuel":
        if (eventDay === todayDay) {
          shouldTrigger = true;
        }
        break;

      case "Annuel":
      case "Anniv'":
        if (eventDay === todayDay && eventMonth === todayMonth) {
          shouldTrigger = true;
        }
        break;
    }

    if (shouldTrigger) {
      console.log("🔔 Rappel :", event.event);

      // 👉 ici :
      // envoyer notif
      // envoyer email
      // stocker notification en DB
    }
  }
}async function checkTodayEvents() {
  const today = new Date();

  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayWeekDay = today.getDay(); // 0 = dimanche

  const events = await Event.find();

  for (const event of events) {
    const eventDate = new Date(event.date);

    const eventDay = eventDate.getDate();
    const eventMonth = eventDate.getMonth();
    const eventWeekDay = eventDate.getDay();

    let shouldTrigger = false;

    switch (event.frequence) {
      case "Quotidien":
        shouldTrigger = true;
        break;

      case "Hebdo":
        if (eventWeekDay === todayWeekDay) {
          shouldTrigger = true;
        }
        break;

      case "Mensuel":
        if (eventDay === todayDay) {
          shouldTrigger = true;
        }
        break;

      case "Annuel":
      case "Anniv'":
        if (eventDay === todayDay && eventMonth === todayMonth) {
          shouldTrigger = true;
        }
        break;
    }

    if (shouldTrigger) {
      console.log("🔔 Rappel :", event.event);

      // 👉 ici :
      // envoyer notif
      // envoyer email
      // stocker notification en DB
    }
  }
}
app.get('/cron/update', async (req, res) => {
  if (req.query.secret !== process.env.CRON_SECRET) {
    return res.status(403).send("Forbidden");
  }

  try {
    console.log("✅ CRON exécuté !");
    await checkTodayEvents();
    res.status(200).send("✅ CRON OK");
  } catch (error) {
    console.error("❌ Erreur CRON:", error);
    res.status(500).send("❌ Erreur serveur");
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
