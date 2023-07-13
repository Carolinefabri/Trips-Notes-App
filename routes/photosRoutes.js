const express = require('express');
const router = express.Router();

// Importe o modelo de foto
const Photo = require('../models/photo');

// Rota para exibir uma foto específica
router.get('/photos/:id', async (req, res) => {
  try {
    // Obtenha o ID da foto da URL de requisição
    const photoId = req.params.id;

    // Encontre a foto no banco de dados usando o modelo Photo
    const photo = await Photo.findById(photoId);

    // Renderize a página photo.ejs e passe a foto como variável
    res.render('photo', { photo });
  } catch (error) {
    console.error('Error retrieving photo:', error);
    res.status(500).send('Error retrieving photo');
  }
});

module.exports = router;
