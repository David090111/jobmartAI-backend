const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const dotenv =  require('dotenv');
dotenv.config();









exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerifyToken: verifyToken,
      emailVerifyTokenExpiry: Date.now() + 3600000, // 1h
    });

    const link = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"JobMartAI" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Verify Your Email - JobMartAI",
      html: `
        <p>Hi ${name},</p>
        <p>Click the link below to verify your email:</p>
        <a href="${link}">${link}</a>
      `,
    });

    res
      .status(201)
      .json({ message: "Please verify your email to activate account." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


exports.verifyEmail = async (req, res) => {
   const { token } = req.params;
  //  console.log(" Token received for verification:", token);


  if (!token) return res.status(400).json({ message: "Missing token" });

  const user = await User.findOne({
    emailVerifyToken: token,
    emailVerifyTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.emailVerified = true;
user.emailVerifyToken = undefined; 
user.emailVerifyTokenExpiry = undefined;
  await user.save();

  const jwtToken = generateToken(user._id);

  res.status(200).json({
    message: "Email verified successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
    },
  });
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

   

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(200)
      .json({
        message: "If this email exists, reset instructions have been sent.",
      });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1h
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, 
    },
  });

  await transporter.sendMail({
    from: `"JobMartAI Support" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: "Password Reset - JobMartAI",
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });

  res.status(200).json({ message: "Reset instructions sent." });
};
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "" });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.status(200).json({ message: "Password has been reset successfully" });
};