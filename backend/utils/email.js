const nodemailer = require("nodemailer");

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // App password (not your real password)
  },
});

const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your OTP for verification is: ${otp}. This OTP expires in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };

