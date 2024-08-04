const express = require('express');
const applicationController = require('../controllers/application.controller');
const router = express.Router();
const documentUpload = require('../middleware/student.document.upload');

router.get('/apply', applicationController.getApply);
router.get('/all', applicationController.getApplications);
router.get('/:id', applicationController.getSingleApplication);

router.post('/apply', documentUpload, applicationController.apply);

router.post('/update/:id', applicationController.updateApplication);



module.exports = router;