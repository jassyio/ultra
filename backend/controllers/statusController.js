const User = require("../models/User");

exports.getStatuses = async (req, res) => {
  try {
    const users = await User.find({}, "name statuses");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statuses" });
  }
};

exports.addStatus = async (req, res) => {
  try {
    const { content, mediaUrl } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.statuses.push({ content, mediaUrl });
    await user.save();

    res.status(201).json({ message: "Status added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add status" });
  }
};