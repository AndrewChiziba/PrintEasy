const express = require('express');
const {
  getLocations,
  addLocation,
  deleteLocation,
} = require('../controllers/locationController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/',protect, getLocations);
router.post('/',protect, addLocation);
router.delete('/:id',protect, deleteLocation);

module.exports = router;
