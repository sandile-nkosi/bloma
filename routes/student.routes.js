const express = require('express');
const studentController = require('../controllers/student.controller');
const router = express.Router();
const documentUpload = require('../middleware/student.document.upload');
const avatarUpload = require('../middleware/student.image.upload');

router.get('/login', studentController.getLogin);
router.get('/logout', studentController.logout);
router.get('/register', studentController.getRegister);
router.get('/dashboard', studentController.getDashboard);



router.post('/login', studentController.login);
router.post('/register', avatarUpload,studentController.register);
router.patch('/update', studentController.updateStudent);


module.exports = router;