const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');


// Rota para criar um novo post

router.get('/trip/create', (req, res) => res.render('trip/create'));




router.post('/create-post', requireAuth, async (req, res) => {
  try {
    const { title, description, imagePath, tripId } = req.body;
    // Faça o processamento necessário com os dados recebidos
    
    // Encontre a trip correspondente ao tripId
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }
    
    // Crie um novo post usando o modelo Trip
    const post = new Trip({
      title,
      description,
      startDate: trip.startDate,
      endDate: trip.endDate,
      location: trip.location,
      image: imagePath
    });
    
    // Salve o post no banco de dados
    await post.save();
    
    // Redirecione para a página desejada após a criação do post
    res.redirect('/admin');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Error creating post');
  }
});

module.exports = router;
