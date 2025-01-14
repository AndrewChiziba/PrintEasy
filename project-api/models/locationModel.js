const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming 'User' is your user model
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
