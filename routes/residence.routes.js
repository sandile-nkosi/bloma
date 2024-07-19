const express = require('express');
const residenceController = require('../controllers/residence.controller');
const router = express.Router();
const imageUpload = require('../middleware/residence.upload');



router.get('/', residenceController.getResidences);

router.post('/', imageUpload, residenceController.newResidence);



module.exports = router;

