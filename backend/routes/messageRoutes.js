const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// Send a message
router.post("/send", async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    // 1. Save message
    const message = await Message.create({ sender: senderId, receiver: receiverId, content });

    // 2. Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        lastMessage: message._id,
      });
    } else {
      conversation.lastMessage = message._id;
      await conversation.save();
    }

    res.json({ message: "Message sent", data: message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending message" });
  }
});

// Get all conversations for a user
router.get("/conversations/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.params.userId,
    })
      .populate("participants", "username email")
      .populate("lastMessage");

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching conversations" });
  }
});

// Get messages between two users
router.get("/:userId/:otherUserId", async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

module.exports = router;
