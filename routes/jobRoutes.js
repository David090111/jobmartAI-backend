
const express = require("express");
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/my-jobs", protect, getMyJobs);

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;
