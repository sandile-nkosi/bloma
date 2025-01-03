const express = require('express');
const studentController = require('../controllers/student.controller');
const applicationController = require('../controllers/application.controller');
const router = express.Router();
const documentUpload = require('../middleware/student.document.upload');
const avatarUpload = require('../middleware/student.image.upload');

router.get('/login', studentController.getLogin);
router.get('/logout', studentController.logout);
router.get('/register', studentController.getRegister);
router.get('/dashboard', studentController.getDashboard);
router.get('/forgot-password', studentController.getForgotPassword);
router.get('/update-password/:email/:otp', studentController.getUpdatePassword);




router.post('/login', studentController.login);
router.post('/register', avatarUpload,studentController.register);
router.post('/update', documentUpload, studentController.updateStudent);
router.post('/forgot-password/otp', studentController.sendOtp);
router.post('/update-password/:email/:otp', studentController.updatePassword);


module.exports = router;