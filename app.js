const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./routes/routes');
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bus_ticket_system');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Routes
app.use(router)

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bus Ticket Management API is running' });
});


// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
