const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/fileDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// File Schema
const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model('File', fileSchema);

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Routes
// Upload a file
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');

  const file = new File({
    filename: req.file.filename,
    originalname: req.file.originalname,
  });

  await file.save();
  res.status(200).send({
    message: 'File uploaded successfully',
    fileId: file._id,
  });
});

// Get list of uploaded files
app.get('/files', async (req, res) => {
  const files = await File.find();
  res.status(200).send(files);
});

// Download a file
app.get('/download/:id', async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).send('File not found');

  const filePath = path.join(__dirname, 'uploads', file.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath, file.originalname);
  } else {
    res.status(404).send('File not found on server');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
