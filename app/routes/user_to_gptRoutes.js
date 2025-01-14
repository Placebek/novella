const express = require('express');
const router = express.Router();
const user_to_gptController = require('../controllers/user_to_gptController');


router.get('/history', user_to_gptController.getUserHistory);

module.exports = router;
