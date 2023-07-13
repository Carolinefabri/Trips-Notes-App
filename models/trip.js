const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
