const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  resetToken: String,
  resetTokenExpiry: Date,
  emailVerified: { type: Boolean, default: false },
  emailVerifyToken: String, // 
  emailVerifyTokenExpiry: Date, // 
});
module.exports = mongoose.model("User", userSchema);