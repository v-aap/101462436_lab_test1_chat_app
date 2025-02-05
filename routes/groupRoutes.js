const express = require('express');
const router = express.Router();
const GroupMessage = require('../model/GroupMessage'); 
// Get Rooms
router.get('/groups', async (req, res) => {
  try {
    const groups = await GroupMessage.distinct("room"); 
    res.status(200).json(groups);
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(500).json({ error: 'Failed to retrieve groups' });
  }
});

// Create a new group/room
router.post('/groups', async (req, res) => {
  try {
    const { room, from_user, message } = req.body;
    if (!room) return res.status(400).json({ error: 'Room name is required' });

    // Check if the group already exists in messages
    const existingGroup = await GroupMessage.findOne({ room });
    if (existingGroup) {
      return res.status(400).json({ error: 'Group already exists' });
    }

    const newGroupMessage = new GroupMessage({ room, from_user, message: "Welcome to " + room });
    await newGroupMessage.save();

    res.status(201).json({ message: 'Group created successfully', room });
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
