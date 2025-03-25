const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contacts: [
    {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    }
  ]
});

module.exports = mongoose.model("Contact", ContactSchema);
