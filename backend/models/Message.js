const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    // For direct messages - making this optional if groupId exists
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    // For group messages - optional if chatId exists
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    deliveredTo: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        deliveredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Message types: text, image, voice, etc.
    messageType: {
      type: String,
      enum: ["text", "image", "voice", "video", "file"],
      default: "text",
    },
    // For media messages
    mediaUrl: String,
    // For message status
    status: {
      type: String,
      enum: ["not_sent", "sent", "delivered", "read", "failed"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

// Either chatId or groupId must be present, not both
MessageSchema.pre("validate", function (next) {
  if (
    (this.chatId && this.groupId) ||
    (!this.chatId && !this.groupId)
  ) {
    next(
      new Error(
        "Message must have either a chatId OR a groupId, not both or neither"
      )
    );
  } else {
    next();
  }
});

// Create indexes for faster querying
MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ groupId: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;