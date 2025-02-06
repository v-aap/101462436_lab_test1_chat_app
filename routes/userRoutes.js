const express = require('express');
const router = express.Router();
const User = require('../model/User');
const PrivateMessage = require('../model/PrivateMessage');

// User Signup
router.post('/signup', async (req, res) => {
    try {
      const { username, firstname, lastname, password } = req.body;
      // Check if Username Exists
      const existingUser = await User.findOne({ username });
      if(existingUser){
        return res.status(400).json({ error: 'Username already exists' });
      }
      const newUser = new User({ username, firstname, lastname, password });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error creating user' });
    }
  });

// User Login
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find User
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Compare Passwords
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const userObj = user.toObject();
      delete userObj.password;
      
      res.status(200).json({ message: 'Login successful', user: userObj });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error during login' });
    }
  });
  


// All Users
router.get('/', async (req, res) => {
    try {
      const users = await User.find({}, 'username');
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching users' });
    }
  });


  // Users with chats together
  router.get('/privateChats/:username', async (req, res) => {
    try {
      const username = req.params.username;

      const sentChats = await PrivateMessage.distinct("to_user", { from_user: username });
      const receivedChats = await PrivateMessage.distinct("from_user", { to_user: username });

      const uniqueChats = [...new Set([...sentChats, ...receivedChats])];

      res.status(200).json(uniqueChats);
    } catch (err) {
      console.error('Error fetching private chats:', err);
      res.status(500).json({ error: 'Failed to retrieve private chats' });
    }
  });



module.exports = router;
