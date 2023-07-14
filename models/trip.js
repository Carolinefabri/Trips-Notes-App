const mongoose = require('mongoose');
const Trip = require('../models/trip');
const { Schema, model } = mongoose;

const tripSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);


module.exports = model('Trip', tripSchema);

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip

