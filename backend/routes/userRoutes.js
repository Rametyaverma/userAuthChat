const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ GET CONTACTS (all users except logged-in)
router.get("/contacts", protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("fullName username email dob");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
