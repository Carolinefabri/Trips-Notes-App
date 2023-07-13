const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imagePath: { type: String, required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
