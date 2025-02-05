const express = require('express');
const router = express.Router();
const GroupMessage = require('../model/GroupMessage');
const PrivateMessage = require('../model/PrivateMessage');

const groupMembers = {};

// Message Retrieval
router.get('/messages', async (req, res) => {
    try {
        const { type, room, from_user, to_user } = req.query;
        let messages;

        if (type === 'group' && room) {
            messages = await GroupMessage.find({ room }).sort({ date_sent: 1 });
        } else if (type === 'private' && from_user && to_user) {
            messages = await PrivateMessage.find({
                $or: [{ from_user, to_user }, { from_user: to_user, to_user: from_user }]
            }).sort({ date_sent: 1 });
        } else {
            return res.status(400).json({ error: 'Invalid request. Provide correct parameters.' });
        }

        res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

// Members per Room
router.get('/groupMembers/:room', (req, res) => {
    const room = req.params.room;
    res.json(groupMembers[room] ? Array.from(groupMembers[room]) : []);
});

module.exports = router;
