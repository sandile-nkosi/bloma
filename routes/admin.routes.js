const express = require('express');
const adminController = require('../controllers/admin.controller');
const router = express.Router();

router.get('/login', adminController.getAdminLogin);

router.get('/logout', adminController.adminLogout);
router.get('/register', adminController.getAdminRegister);
router.get('/dashboard', adminController.getAdminDashboard);

router.post('/register', adminController.adminRegister);
router.post('/login', adminController.adminLogin);


module.exports = router;
