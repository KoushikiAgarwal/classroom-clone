const jwt = require('jsonwebtoken');

// Middleware to protect routes by verifying the JWT token
const protect = (req, res, next) => {
  let token;

  // Check if the token is in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get the token from the Authorization header
      token = req.headers.authorization.split(' ')[1]; // "Bearer token"

      // Verify the token using JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add the decoded user ID to the request object
      req.user = decoded.userId;

      next(); // Call the next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If there is no token
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;
