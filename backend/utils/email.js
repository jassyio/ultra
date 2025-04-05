const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Or use "Outlook", "Yahoo", etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Send OTP Email
const sendOTPEmail = async (email, otp) => {
  try {
    console.log("🔹 Sending OTP Email...");
    console.log("🔹 To:", email);
    console.log("🔹 OTP:", otp);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
      html: `<p>Your OTP code is: <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return false;
  }
};

module.exports = { sendOTPEmail };
