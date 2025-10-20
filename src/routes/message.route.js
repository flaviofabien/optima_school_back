const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllMessage} = 
require('../controllers/message.controller');

router.get('/:user1/:user2',authMiddleware,getAllMessage);

module.exports = router;