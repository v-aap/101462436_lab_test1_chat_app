const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const User = require('./model/User');
const GroupMessage = require('./model/GroupMessage');
const PrivateMessage = require('./model/PrivateMessage');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/groupRoutes');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//MongoDB:
const uri = 'mongodb+srv://valeria:LabTest1@cluster0.64waw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB Atlas Connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'view')));

// Routes
app.use('/api', chatRoutes);     
app.use('/api/users', userRoutes); 
app.use('/api', groupRoutes);

// Socket.io
require('./socket')(io);

// Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});