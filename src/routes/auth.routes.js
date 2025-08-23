const express = require("express");
const router = express.Router();
const {register,login,resetPassword,updatePassword} = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/update-password', updatePassword);

module.exports = router;