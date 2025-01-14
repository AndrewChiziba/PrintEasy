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

// Add a new location for the authenticated user
exports.addLocation = async (req, res) => {
  try {
    const { name, address } = req.body;
    const newLocation = new Location({
      name,
      address,
      user: req.user.id, // Associate the location with the user
    });

    console.log("req: ",req);
    
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
