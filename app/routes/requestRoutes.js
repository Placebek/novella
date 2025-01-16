const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const upload = require('../config/multerConfig');


router.post('/create/requests', upload.single('mp3'), requestController.createRequest);
// router.put('/:id', requestController.updateRequest);

module.exports = router;
