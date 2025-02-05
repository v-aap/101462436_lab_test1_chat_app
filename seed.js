const mongoose = require('mongoose');
const User = require('./model/User'); 
const GroupMessage = require('./model/GroupMessage'); 
const PrivateMessage = require('./model/PrivateMessage'); 

// Example seed data for Users
const seedUsers = [
  { username: 'alice', firstname: 'Alice', lastname: 'Wonderland', password: 'password123' },
  { username: 'bob', firstname: 'Bob', lastname: 'Builder', password: 'password123' },
  { username: 'charlie', firstname: 'Charlie', lastname: 'Brown', password: 'password123' }
];

// Optional: Seed data for GroupMessages
const seedGroupMessages = [
  { from_user: 'alice', room: 'devops', message: 'Hello DevOps!' },
  { from_user: 'bob', room: 'devops', message: 'Hi everyone!' }
];

// Optional: Seed data for PrivateMessages
const seedPrivateMessages = [
  { from_user: 'alice', to_user: 'bob', message: 'Hey Bob, how are you?' }
];

//MongoDB:
const uri = 'mongodb+srv://valeria:LabTest1@cluster0.64waw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB for seeding.");

    // Optionally clear out existing data
    await User.deleteMany({});
    await GroupMessage.deleteMany({});
    await PrivateMessage.deleteMany({});

    // Insert the seed data
    const insertedUsers = await User.insertMany(seedUsers);
    console.log("Seeded Users:", insertedUsers);

    // If you want to seed group messages:
    const insertedGroupMessages = await GroupMessage.insertMany(seedGroupMessages);
    console.log("Seeded Group Messages:", insertedGroupMessages);

    // If you want to seed private messages:
    const insertedPrivateMessages = await PrivateMessage.insertMany(seedPrivateMessages);
    console.log("Seeded Private Messages:", insertedPrivateMessages);

    // Disconnect when done
    mongoose.disconnect();
    console.log("Seeding complete. Disconnected from MongoDB.");
  })
  .catch(err => {
    console.error("Error seeding data:", err);
    mongoose.disconnect();
  });
