const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }
  },
  { timestamps: true }
);

// Ensure only 2 participants max
conversationSchema.pre("save", function (next) {
  if (this.participants.length !== 2) {
    return next(new Error("A private conversation must have exactly 2 participants."));
  }
  next();
});

module.exports = mongoose.model("Conversation", conversationSchema);
