// routes/movie.routes.js

const express = require('express');
const router = express.Router();

// GET route to display the form to create a new movie
router.get('/trips/create', (req, res) => res.render('movie-views/movie-create'));

module.exports = router;
