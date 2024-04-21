//const { connection1 } = require('../server');
const { verifyToken } = require('../LogInTokens');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');


// DELETE route for deleting a user account
router.delete('/user', verifyToken, async (req, res) => {
  try {
    console.log('Incoming headers:', req.headers);

    // Check if req.user exists and has userId property
    if (!req.user || !req.user.userId) {
      throw new Error('User information not available');
    }

    // Get the user ID from the decoded token
    const userId = req.user.userId;

    // Get the user's password from the request body
    const { password } = req.body;
    console.log('Entered password:', password);

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user is not found, respond with an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

 // Compare the entered password with the stored hashed password
const isPasswordValid = await user.comparePassword(password);
console.log('Is password valid:', isPasswordValid);

    if (!isPasswordValid) {
      // If the password is not valid, respond with an error
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Perform the logic to delete the user account based on the user ID
    await User.findByIdAndDelete(userId);

    // Respond with a success message or appropriate response
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
