const User = require("../models/User");

// Register a new user
const registerUser = async (req, res) => {
  res.status(200).json({ message: "Register user endpoint" });
};

// Login a user
const loginUser = async (req, res) => {
  res.status(200).json({ message: "Login user endpoint" });
};

// Verify user (e.g., email/OTP verification)
const verifyUser = async (req, res) => {
  res.status(200).json({ message: "Verify user endpoint" });
};

// Check if user exists by email
const checkUser = async (req, res) => {
  try {
    const rawEmail = req.query.email;

    if (typeof rawEmail !== "string" || rawEmail.trim() === "") {
      console.log("Backend: Invalid or missing email in the request");
      return res
        .status(400)
        .json({ exists: false, message: "Valid email is required" });
    }

    const email = rawEmail.trim().toLowerCase();
    console.log("Backend: Checking email:", email);

    const user = await User.findOne({ email }).select("-password");

    if (user) {
      const responseData = {
        exists: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || "/default-avatar.png", // Provide a default avatar
        },
      };
      console.log("Backend: User found ->", responseData);
      return res.status(200).json(responseData);
    } else {
      console.log("Backend: No user found for email:", email);
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Backend: Error in checkUser:", error);
    return res
      .status(500)
      .json({ exists: false, message: "Server error while checking user" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  checkUser,
};
