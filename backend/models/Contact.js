const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  owner:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contact: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);
