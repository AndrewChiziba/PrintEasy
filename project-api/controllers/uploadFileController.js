const UploadFile = require('../models/uploadFileModel');
const Location = require('../models/locationModel'); // Assuming this is the location model
const User = require('../models/userModel'); // Assuming this is the user model


const addUploadFile = async (req, res) => {
  try {
    const { name, userId, locationId, queueId, printPreferences } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    // Check if location and user exist
    const location = await Location.findById(locationId);
    const user = await User.findById(userId);

    if (!location || !user) {
      return res.status(400).json({ message: 'Invalid location or user ID' });
    }

    const newUpload = new UploadFile({
      name,
      binaryContents: req.file.buffer, // Use the file buffer
      userId,
      locationId,
      queueId,
      printPreferences: printPreferences, // Parse JSON string if sent as a string
    });

    await newUpload.save();
    res.status(201).json(newUpload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading file' });
  }
};

module.exports = { addUploadFile };



// Get all uploaded files
const getUploadFiles = async (req, res) => {
  try {
    const uploads = await UploadFile.find().populate('userId locationId');
    res.status(200).json(uploads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching files' });
  }
};

// Get a specific upload file by ID
const getUploadFileById = async (req, res) => {
  try {
    const upload = await UploadFile.findById(req.params.id).populate('userId locationId');

    if (!upload) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.status(200).json(upload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching file' });
  }
};

// Update a file upload (e.g., print preferences)
const updateUploadFile = async (req, res) => {
  try {
    const { printPreferences } = req.body;

    const updatedUpload = await UploadFile.findByIdAndUpdate(
      req.params.id,
      { printPreferences },
      { new: true }
    );

    if (!updatedUpload) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.status(200).json(updatedUpload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating file' });
  }
};

// Delete a file upload
const deleteUploadFile = async (req, res) => {
  try {
    const upload = await UploadFile.findByIdAndDelete(req.params.id);

    if (!upload) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting file' });
  }
};

module.exports = {
  addUploadFile,
  getUploadFiles,
  getUploadFileById,
  updateUploadFile,
  deleteUploadFile
};