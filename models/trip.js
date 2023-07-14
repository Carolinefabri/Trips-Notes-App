const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tripSchema = new Schema({
  location: {
    type: String,
    
  },
  endDate: {
    type: Date,
    
  },
  startDate: {
    type: Date,
    
  },
  title: {
    type: String,
 
  },
  image: {
    type: String,
  
  }
});

const Trip = model('Trip', tripSchema);

module.exports = Trip;
