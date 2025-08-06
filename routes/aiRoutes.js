const express = require('express');
const{askAI} = require('../controllers/aiController');
const  protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, askAI);

module.exports = router;