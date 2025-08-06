const express = require('express');
const multer = require('multer');
const {storage} = require('../utils/cloudinary');
const protect = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({storage});

// Route to upload a file
router.post("/single", protect, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(200).json({
    message: "File uploaded successfully",
    fileUrl: req.file.path, // URL ảnh Cloudinary
  });
});

module.exports = router;