const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/noteBookApp"
async function connectToMongo() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

module.exports =connectToMongo;