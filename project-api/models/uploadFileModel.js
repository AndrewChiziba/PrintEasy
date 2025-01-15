const mongoose = require('mongoose');

const uploadFileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  binaryContents: {
    type: (Buffer), // Binary data will be stored as Buffer
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming 'User' is your user model
    required: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location', // Referring to the 'Location' model where the files are uploaded
    required: true,
  },
  queueId: {
    type: String,
    required: true,
    unique: true, // Ensure each queue has a unique ID
  },
  printPreferences: {
    type: {
      type: String, // 'color' or 'grayscale'
      required: true,
    },
    size: {
      type: String, // 'A4', 'A3', 'letter', etc.
      required: true,
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('UploadFile', uploadFileSchema);
