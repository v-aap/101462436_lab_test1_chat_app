# 💬 Real-Time Chat App (Node.js, Express, Socket.io, MongoDB)

## 📝 Overview
This is a **real-time chat application** built using **Node.js, Express, Socket.io, and MongoDB**. It supports **private messaging**, **group chats**, **real-time updates**, and **message persistence** with MongoDB.

## 📌 Features
✔ **User Authentication** (Local storage-based session management)  
✔ **Real-time Group Chat** (Multiple rooms supported)  
✔ **Private Messaging** (Direct one-on-one chat)  
✔ **Auto-Refresh on New Messages** (No need to manually refresh the page)  
✔ **Group Members List** (Shows active users in a room)  
✔ **Chat History Persistence** (Messages stored in MongoDB)  
✔ **User Presence Detection** (Tracks online/offline users)  
✔ **Password Hashing** (Secure authentication using bcrypt)  
✔ **Message Timestamps & Date Separation**  

---

## ⚙️ Tech Stack
- **Frontend:** HTML, CSS, Bootstrap, jQuery  
- **Backend:** Node.js, Express.js  
- **Real-time Communication:** Socket.io  
- **Database:** MongoDB (Mongoose ORM)  
- **Authentication:** Local storage-based  
- **Security:** bcrypt.js for password hashing  

---

## 🚀 Installation & Setup

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app
```

### 🎯 Usage Guide
🔹 User Registration & Login
Users are stored in MongoDB and authenticated via local storage.
Passwords are securely hashed using bcrypt.
🔹 Group Chat
Users can create or join chat rooms dynamically.
Messages are stored in MongoDB and persist across sessions.
The members list updates in real-time.
Messages auto-scroll on updates.
🔹 Private Messaging
Direct one-on-one chats with real-time updates.
Conversations are stored in MongoDB.
Read receipts & timestamps are displayed.
🔹 Admin Features
Database Seeding: Run node seed.js to create test data.
User Presence: Online users are tracked using Socket.io.
📌 API Endpoints
Route	Method	Description
/api/users	GET	Get all users
/api/groups	GET	Get all available chat rooms
/api/messages	GET	Fetch chat history (private/group)
/api/send	POST	Send a message
/api/users/privateChats/:username	GET	Get a user's private chats