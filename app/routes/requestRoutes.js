const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const upload = require('../config/multerConfig');


router.post('/create/requests', upload.single('mp3'), requestController.createRequest);
router.get('/by-request/:request_id', requestController.getUserToGptsByRequestId);
router.get('/get', requestController.getRequests);
router.get('/unfinished', requestController.getUnfinishedRequests);

module.exports = router;
