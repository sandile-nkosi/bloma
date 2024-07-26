const express = require('express');
const applicationController = require('../controllers/application.controller');
const router = express.Router();
const documentUpload = require('../middleware/student.document.upload');

router.get('/apply', applicationController.getApply);

router.post('/apply', documentUpload, applicationController.apply);



module.exports = router;