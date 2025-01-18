const express = require('express');
const {
  getUploadFiles,
  addUploadFile,
  getUploadFileById,
  updateUploadFile,
  deleteUploadFile
} = require('../controllers/uploadfileController');
const protect = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();

router.get('/',protect, getUploadFiles); // Get all uploaded files
router.get('/:id',protect, getUploadFileById); // Get a specific upload by ID
//router.post('/', addUploadFile); // Add a new file to upload
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // Limit file size to 5MB
router.post('/', upload.single('binaryContents'), addUploadFile); // Add a new file to upload
router.put('/:id', updateUploadFile); // Update upload file details
router.delete('/:id', deleteUploadFile); // Delete an upload by ID

module.exports = router;
