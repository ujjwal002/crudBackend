const express = require('express');

const router = express.Router();

const ctrl = require('../controllers/userCtrl')

router.post('/adduser', ctrl.signUp);
router.post('/login',ctrl.login);
router.post('/forgotpassword',ctrl.forgotPassword)
router.post('/resetpassword',ctrl.resetPassword)

module.exports = router;
