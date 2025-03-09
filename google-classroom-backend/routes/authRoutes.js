const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Assignment = require('../models/Assignment');  // Import the Assignment model
const protect = require('../middleware/authMiddleware'); // Ensure only authorized users can access the routes
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// View All Assignments
router.get('/assignments', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find().populate('user', 'name email');  // Populate user info
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments' });
  }
});

// View a Single Assignment
router.get('/assignments/:id', protect, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('user', 'name email');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignment' });
  }
});

// Create Assignment (Submit Assignment)
router.post('/assignments', protect, async (req, res) => {
  const { title, description, submissionDate } = req.body;
  try {
    const newAssignment = new Assignment({
      title,
      description,
      submissionDate,
      user: req.user,  // Assign the user who submitted the assignment
    });
    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting assignment' });
  }
});

// Edit Assignment
router.put('/assignments/:id', protect, async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { ...req.body },  // Update fields with the new data
      { new: true }
    );
    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating assignment' });
  }
});

// Delete Assignment
router.delete('/assignments/:id', protect, async (req, res) => {
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!deletedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment' });
  }
});

module.exports = router;
