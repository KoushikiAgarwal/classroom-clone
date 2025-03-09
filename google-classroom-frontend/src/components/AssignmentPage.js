// src/components/AssignmentPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Import useHistory to redirect

const AssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // To show loading spinner
  const history = useHistory(); // For redirection

  // Redirect to Login page if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      history.push('/login'); // Redirect to login page if no token found
    }
  }, [history]);

  // Fetch the assignments after the page loads
  useEffect(() => {
    const fetchAssignments = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5001/api/auth/assignments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssignments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching assignments');
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Handle assignment submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('Please login first');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5001/api/auth/assignments',
        {
          title,
          description,
          submissionDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssignments([...assignments, response.data]);
      setTitle('');
      setDescription('');
      setSubmissionDate('');
    } catch (err) {
      setError('Error submitting assignment');
    }
  };

  return (
    <div>
      <h2>Assignments</h2>

      {/* Assignment Submission Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Submission Date</label>
          <input
            type="date"
            value={submissionDate}
            onChange={(e) => setSubmissionDate(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Submit Assignment</button>
      </form>

      {/* Display Submitted Assignments */}
      <h3>Submitted Assignments</h3>
      {loading ? (
        <p>Loading...</p> // Show loading spinner/message while fetching assignments
      ) : (
        <ul>
          {assignments.map((assignment) => (
            <li key={assignment._id}>
              <h4>{assignment.title}</h4>
              <p>{assignment.description}</p>
              <p>Due on: {assignment.submissionDate}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignmentPage;
