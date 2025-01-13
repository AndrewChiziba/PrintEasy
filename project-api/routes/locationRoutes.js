const express = require('express');
const {
  getLocations,
  addLocation,
  deleteLocation,
} = require('../controllers/locationController');

const router = express.Router();

router.get('/', getLocations);
router.post('/', addLocation);
router.delete('/:id', deleteLocation);

module.exports = router;
