const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendOTPEmail } = require("../utils/email");

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Register User
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ $or: [{ email }, { phone }] });

    if (user && user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (!user) {
      user = new User({
        name,
        email,
        phone,
        password,
        isVerified: false,
      });
    } else {
      user.name = name;
      user.phone = phone;
      user.password = password;
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await user.save();

    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    if (new Date(user.otpExpires) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "OTP verified", token });
  } catch (error) {
    console.error("❌ Verify OTP Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "New OTP sent to email" });
  } catch (error) {
    console.error("❌ Resend OTP Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Dummy Login (just for example)
const login = async (req, res) => {
  res.status(200).json({ message: "Login endpoint hit!" });
};

module.exports = { register, verifyOTP, login, resendOTP };
