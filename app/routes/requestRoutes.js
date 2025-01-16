const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const upload = require('../config/multerConfig');


router.post('/create/requests', upload.single('mp3'), requestController.createRequest);

module.exports = router;
