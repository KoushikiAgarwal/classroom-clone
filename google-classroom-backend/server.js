const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // To use environment variables

const app = express();
const PORT = process.env.PORT || 5001; // Change 5000 to another number like 5001


// Import authentication routes
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(express.json()); // To parse JSON request bodies
const protect = require('./middleware/authMiddleware');

// Connect to MongoDB (MongoDB Atlas or local MongoDB)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

// Basic Route to check if the server is running
app.get('/', (req, res) => {
  res.send('Welcome to Google Classroom Clone!');
});

// Use authentication routes
app.use('/api/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.post('/api/submit-assignment', protect, (req, res) => {
    // Your logic for assignment submission
    res.send('Assignment submitted successfully');
  });
  