const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllState} = require('../controllers/state.controller');

router.get('/state/',authMiddleware,getAllState);

module.exports = router;