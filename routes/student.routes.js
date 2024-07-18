const express = require('express');
const studentController = require('../controllers/student.controller');
const router = express.Router();
const documentUpload = require('../middleware/document.upload');

router.get('/login', studentController.getLogin);
router.get('/logout', studentController.logout);
router.get('/register', studentController.getRegister);
router.get('/dashboard', studentController.getDashboard);
router.get('/apply', studentController.getApply);


router.post('/login', studentController.login);
router.post('/register', studentController.register);
router.post('/apply', documentUpload, studentController.apply);

module.exports = router;