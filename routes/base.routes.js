const express = require('express');
const baseController = require('../controllers/base.controller');
const router = express.Router();

// routes
router.get('/', baseController.getIndex);

router.get('/residences', baseController.getResidences);

router.get('/about', baseController.getAbout);


module.exports = router;