const express = require('express');
const router = express.Router();

// Importe o modelo de viagem
const Trip = require('../models/trip');

// Rota para exibir todas as viagens
router.get('/trips', async (req, res) => {
  try {
    // Obtenha todas as viagens do banco de dados usando o modelo Trip
    const trips = await Trip.find();

    // Renderize a página trips.ejs e passe as viagens como variável
    res.render('trips', { trips });
  } catch (error) {
    console.error('Error retrieving trips:', error);
    res.status(500).send('Error retrieving trips');
  }
});

module.exports = router;
