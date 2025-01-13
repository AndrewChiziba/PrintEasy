const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the database connection function
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const locationRoutes = require('./routes/locationRoutes'); // Import location routes
const cors = require('cors'); 

dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB

const app = express();

app.use(express.json()); // Middleware to parse JSON

// Middleware to enable CORS
app.use(cors());

// Define routes
app.use('/api/locations', locationRoutes); // Protected locations route
app.use('/api/auth', authRoutes); // Auth routes for login and registration

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: err.message });
});

module.exports = app;
