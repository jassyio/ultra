const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }
    ], // ✅ Each chat includes both users
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      default: null,
    },
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
