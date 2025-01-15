const Location = require('../models/locationModel');

// Get all locations for the authenticated user
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find({ user: req.user.id }); // Filter by user
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single location for the authenticated user
exports.getLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findOne({ _id: id, user: req.user.id }); // Filter by user
    if (!location) {
      return res.status(404).json({ message: 'Location not found or not authorized' });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new location for the authenticated user
exports.addLocation = async (req, res) => {
  try {
    const { name, address, contacts } = req.body;

    // Ensure that contacts is an object with any of the optional fields
    const newLocation = new Location({
      name,
      address,
      contacts, // Includes whatsapp, telegram, email, and phone
      user: req.user.id, // Associate the location with the user
    });

    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a location for the authenticated user
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findOneAndDelete({ _id: id, user: req.user.id }); // Ensure the location belongs to the user
    if (!location) {
      return res.status(404).json({ message: 'Location not found or not authorized' });
    }
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
