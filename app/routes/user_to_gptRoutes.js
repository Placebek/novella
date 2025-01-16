const express = require('express');
const router = express.Router();
const user_to_gptController = require('../controllers/user_to_gptController');


router.post('/create/usertogpts', user_to_gptController.createUserToGpt);
router.post('/post/usertogpts', user_to_gptController.postUserToGpt);

module.exports = router;
