const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require("../controllers/productsController");
const { storage } = require("../utils/cloudinary");
const multer = require("multer");
const upload = multer({ storage });

const protect = require("../middleware/authMiddleware");

//  Route to create a new product (with image upload)
router.post("/", protect, upload.single("image"), createProduct);

// Route to get all products
router.get("/", getProducts);

// Route to get a product by ID


// Route to update a product
router.put("/:id", protect, upload.single("image"), updateProduct);
// Route to delete a product
router.delete("/:id", protect, deleteProduct);
router.get("/my-products", protect, getMyProducts);
router.get("/:id", getProductById);

module.exports = router;
