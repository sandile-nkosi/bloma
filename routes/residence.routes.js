const express = require('express');
const residenceController = require('../controllers/residence.controller');
const router = express.Router();
const imageUpload = require('../middleware/residence.upload');



router.get('/', residenceController.getResidences);
router.get('/:id', residenceController.getSingleResidence);

router.post('/', imageUpload, residenceController.newResidence);

router.post('/apply/new/:id', residenceController.addResidence);


module.exports = router;

