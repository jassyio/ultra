const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",  // Change this
    pass: "your-app-password",  // Use App Password
  },
});

const mailOptions = {
  from: "your-email@gmail.com",
  to: "your-email@gmail.com",
  subject: "Test Email",
  text: "This is a test email to check SMTP settings.",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log("❌ Error:", error);
  } else {
    console.log("✅ Email sent:", info.response);
  }
});
