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
  contacts: {
    whatsapp: {
      type: String,
    },
    telegram: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming 'User' is your user model
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
