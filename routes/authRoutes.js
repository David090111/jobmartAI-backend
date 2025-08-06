const express = require('express');
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");
const router = express.Router();


router.post("/reset-password/:token", resetPassword);

router.post('/register', register);
router.post('/login', login);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
module.exports = router;