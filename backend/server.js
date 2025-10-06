const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const cors = require("cors");
require("dotenv").config();

// Setup for Messages and Conversations
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");


dotenv.config();
connectDB();
const app = express();

// Setup for Messages and Conversations
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// ✅ Create/Get conversation
app.post("/conversations", async (req, res) => {
  const { senderId, receiverId } = req.body;

  let conversation = await Conversation.findOne({
    members: { $all: [senderId, receiverId] }
  });

  if (!conversation) {
    conversation = new Conversation({ members: [senderId, receiverId] });
    await conversation.save();
  }

  res.json(conversation);
});

// ✅ Send message
app.post("/messages", async (req, res) => {
  const { conversationId, sender, text } = req.body;

  const newMessage = new Message({ conversationId, sender, text });
  await newMessage.save();

  io.to(conversationId).emit("newMessage", newMessage); // 🔥 real-time

  res.json(newMessage);
});

// ✅ Get messages
app.get("/messages/:conversationId", async (req, res) => {
  const messages = await Message.find({ conversationId: req.params.conversationId });
  res.json(messages);
});


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/auth'));

app.use("/api/allusers",require("./routes/userRoutes"))

const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
