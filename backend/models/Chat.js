const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],
  messages: [messageSchema]
}, {
  timestamps: true
});

// Ensure exactly 2 participants
chatSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    next(new Error('Chat must have exactly 2 participants'));
  }
  next();
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
