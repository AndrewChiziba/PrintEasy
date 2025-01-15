const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the database connection function
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const locationRoutes = require('./routes/locationRoutes'); // Import location routes
const uploadRoutes = require('./routes/uploadRoutes'); // Import upload routes
const cors = require('cors'); 
const bodyParser = require('body-parser');

dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB

const app = express();



// Set the limit for incoming JSON payloads
app.use(express.json({ limit: '5mb' }));

// Set the limit for URL-encoded payloads
app.use(express.urlencoded({ limit: '5mb', extended: true }));


// Middleware to enable CORS
app.use(cors());

// Define routes
app.use('/api/locations', locationRoutes); // Protected locations route
app.use('/api/auth/', authRoutes); // Auth routes for login and registration
app.use('/api/uploads', uploadRoutes); // Protected uploads route

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: err.message });
});

module.exports = app;
