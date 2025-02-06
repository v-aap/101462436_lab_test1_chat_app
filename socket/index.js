const onlineUsers = {}; 
const groupMembers = {}; 

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Register Users
    socket.on('register', (username) => {
      onlineUsers[username] = socket.id;
      console.log(`${username} registered with socket id: ${socket.id}`);
    });

    // Join Room
    socket.on('joinRoom', async ({ username, room }) => {
      if (socket.rooms.has(room)) {
          console.log(`${username} is already in room: ${room}, skipping join.`);
          return; 
      }
  
      socket.join(room);
      console.log(`${username} joined room: ${room}`);
  
      if (!groupMembers[room]) {
          groupMembers[room] = new Set();
      }
      groupMembers[room].add(username);
  
      // Member Update
      io.to(room).emit('updateMembers', Array.from(groupMembers[room]));
  
      socket.to(room).emit('message', { from: 'system', message: `${username} has joined the room` });
  
      // Previous Messages
      try {
          const GroupMessage = require('../model/GroupMessage');
          const messages = await GroupMessage.find({ room }).sort({ createdAt: 1 });
  
          socket.emit('loadMessages', messages);
      } catch (err) {
          console.error('Error loading group messages:', err);
      }
  });
  

    // Room Messages
    socket.on('chatMessage', async (data) => {
      const { from_user, room, message } = data;
  
      console.log(`Received message in ${room} from ${from_user}: ${message}`);
  
      io.to(room).emit('message', data);
  
      try {
          const GroupMessage = require('../model/GroupMessage');
          const newMessage = new GroupMessage({ from_user, room, message });
          await newMessage.save();
      } catch (err) {
          console.error('Error saving group message:', err);
      }
  });
  
    // Member Leaving
    socket.on('leaveRoom', ({ username, room }) => {
      socket.leave(room);
      console.log(`${username} left room: ${room}`);

      if (groupMembers[room]) {
        groupMembers[room].delete(username);
        io.to(room).emit('updateMembers', Array.from(groupMembers[room]));
      }

      socket.to(room).emit('message', { from: 'system', message: `${username} has left the room` });
    });
  


  // PRIVATE MESSAGES
  socket.on('privateMessage', async (data) => {
    const { from_user, to_user, message } = data;
    const recipientSocketId = onlineUsers[to_user];

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('privateMessage', data);
    }

    try {
      const PrivateMessage = require('../model/PrivateMessage');
      const newPrivateMessage = new PrivateMessage({ from_user, to_user, message });
      await newPrivateMessage.save();
    } catch (err) {
      console.error('Error saving private message:', err);
    }
  });

  // Typing
  socket.on('typing', ({ username, to_user }) => {
    const recipientSocketId = onlineUsers[to_user];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('userTyping', { username });
    }
  });

  socket.on('stopTyping', ({ to_user }) => {
    const recipientSocketId = onlineUsers[to_user];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('userStoppedTyping');
    }
  });

  // Logout
  socket.on('logout', (username) => {
    console.log(`${username} logged out.`);
    delete onlineUsers[username];

    for (const room in groupMembers) {
      if (groupMembers[room].has(username)) {
        groupMembers[room].delete(username);
        io.to(room).emit('updateMembers', Array.from(groupMembers[room]));
      }
    }
    socket.disconnect(true);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    const username = Object.keys(onlineUsers).find(user => onlineUsers[user] === socket.id);
    if (username) {
      delete onlineUsers[username];

      for (const room in groupMembers) {
        if (groupMembers[room].has(username)) {
          groupMembers[room].delete(username);
          io.to(room).emit('updateMembers', Array.from(groupMembers[room]));
        }
      }
    }
  });
});
};
