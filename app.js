require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Trip = require('./models/trip');

const app = express();
const MONGODB_URI = 'mongodb://localhost:27017/trektrove';

// Configurações do servidor
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conectar ao banco de dados
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database');

    // Configuração das rotas
    app.get('/', (req, res) => {
      Trip.find()
        .then((trips) => {
          res.render('index', { trips: trips });
        })
        .catch((error) => {
          console.error('Error retrieving trips:', error);
          res.status(500).send('Error retrieving trips');
        });
    });

    app.post('/trips', (req, res) => {
      const { destination, dates, itinerary } = req.body;
    
      const trip = new Trip({ destination, dates, itinerary });
      trip.save()
        .then(() => {
          res.redirect('/');
        })
        .catch((error) => {
          console.error('Error creating the trip:', error);
          res.status(500).send('Error creating the trip');
        });
    });

    // Iniciar o servidor
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
