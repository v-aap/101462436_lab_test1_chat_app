const onlineUsers = {};
const groupMembers = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Register user for private messaging
    socket.on('register', (username) => {
      onlineUsers[username] = socket.id;
      console.log(`${username} registered with socket id: ${socket.id}`);
    });

    // Group chat: join room
    socket.on('joinRoom', ({ username, room }) => {
      socket.join(room);
      console.log(`${username} joined room: ${room}`);

      // ✅ Add user to the group members list
      if (!groupMembers[room]) {
        groupMembers[room] = new Set();
      }
      groupMembers[room].add(username);

      // Notify room members about the update
      io.to(room).emit('updateMembers', Array.from(groupMembers[room]));

      socket.to(room).emit('message', {
        from: 'system',
        message: `${username} has joined the room`
      });
    });

    // Group chat: message event
    socket.on('chatMessage', async (data) => {
      const { from_user, room, message } = data;
      io.to(room).emit('message', data);
      try {
        const GroupMessage = require('../model/GroupMessage');
        const newMessage = new GroupMessage({ from_user, room, message });
        await newMessage.save();
      } catch (err) {
        console.error('Error saving group message:', err);
      }
    });

    // Typing indicator for group chat
    socket.on('typing', ({ username, room }) => {
      socket.to(room).emit('typing', { username });
    });

    // Group chat: leave room
    socket.on('leaveRoom', ({ username, room }) => {
      socket.leave(room);
      console.log(`${username} left room: ${room}`);

      // ✅ Remove user from group members list
      if (groupMembers[room]) {
        groupMembers[room].delete(username);
        io.to(room).emit('updateMembers', Array.from(groupMembers[room])); // ✅ Update UI in real-time
      }

      socket.to(room).emit('message', {
        from: 'system',
        message: `${username} has left the room`
      });
    });


    // Private messaging
    socket.on('privateMessage', async (data) => {
      const { from_user, to_user, message } = data;
      const recipientSocketId = onlineUsers[to_user];

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('privateMessage', data);
      }

      // Store message
      try {
        const PrivateMessage = require('../model/PrivateMessage');
        const newPrivateMessage = new PrivateMessage({ from_user, to_user, message });
        await newPrivateMessage.save();
      } catch (err) {
        console.error('Error saving private message:', err);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      for (const username in onlineUsers) {
        if (onlineUsers[username] === socket.id) {
          delete onlineUsers[username];
          console.log(`Removed ${username} from online users.`);
          break;
        }
      }
    });
  });
};
