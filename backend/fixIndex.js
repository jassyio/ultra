const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    try {
      await User.collection.dropIndex("mobile_1");
      console.log("✅ Duplicate mobile index removed");
    } catch (err) {
      console.error("⚠️ No mobile index found or already dropped:", err.message);
    }

    process.exit();
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });
