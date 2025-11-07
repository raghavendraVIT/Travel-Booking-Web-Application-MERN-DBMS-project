const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

//for hotel images
const path = require('path');
const app = express();

// Load environment variables
dotenv.config();
console.log('Mongo URI:', process.env.MONGO_URI); // Debugging log

// Connect to Database
connectDB();

//const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests from the client
app.use(express.json()); // Body parser for JSON data

//for images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Route Setup
app.use('/api/users', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

// Simple health check route
app.get('/', (req, res) => {
    res.send('MakeMyTrip Clone API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
