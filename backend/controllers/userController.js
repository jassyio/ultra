const User = require("../models/User");

// @desc    Check if user exists and is verified
// @route   GET /api/users/check?email=user@example.com
// @access  Private
const checkUser = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ exists: false, isVerified: false });
    }

    return res.status(200).json({ exists: true, isVerified: user.isVerified });
  } catch (error) {
    console.error("Error checking user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  checkUser,
};
