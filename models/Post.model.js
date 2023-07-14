const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tripSchema = new Schema({
  location: {
    type: String,
    
  },
  title: {
    type: String,
 
  },
 
  comment: {
    type: String,
    
  },
  
  image: {
    type: String,
  
  }
});

const Post = model('Post', tripSchema);


module.exports = Post

