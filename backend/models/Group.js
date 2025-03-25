const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Group members
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Admins
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Group messages
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Creator
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);
