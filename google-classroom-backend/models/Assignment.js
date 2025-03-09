const mongoose = require('mongoose');

// Define the Assignment Schema
const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  submissionDate: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Referencing the User model
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the Assignment model
const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
