const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "Sender ID is required"],
      validate: {
        validator: function(v) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: props => `${props.value} is not a valid user ID!`
      }
    },
    chatId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Chat", 
      required: [true, "Chat ID is required"],
      validate: {
        validator: function(v) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: props => `${props.value} is not a valid chat ID!`
      }
    },
    content: { 
      type: String, 
      required: [true, "Message content is required"],
      minlength: [1, "Message must be at least 1 character long"],
      maxlength: [5000, "Message cannot exceed 5000 characters"],
      trim: true
    },
    status: { 
      type: String, 
      enum: {
        values: ["sent", "delivered", "read"],
        message: "Status must be either 'sent', 'delivered', or 'read'"
      }, 
      default: "sent",
      select: false
    },
    attachments: [{
      url: String,
      type: {
        type: String,
        enum: ["image", "video", "audio", "file"]
      }
    }]
  },
  { 
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for better query performance
MessageSchema.index({ chatId: 1 });
MessageSchema.index({ sender: 1 });
MessageSchema.index({ createdAt: -1 });

// Pre-save hook to validate data
MessageSchema.pre("save", function(next) {
  if (this.isModified("content")) {
    this.content = this.content.trim();
  }
  
  if (this.isModified("status") && !["sent", "delivered", "read"].includes(this.status)) {
    this.status = "sent";
  }
  
  next();
});

module.exports = mongoose.model("Message", MessageSchema);