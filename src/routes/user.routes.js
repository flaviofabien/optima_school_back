const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllUsers,getOneUser,putUser,deleteUser,postUsers} = require('../controllers/user.controller');

router.get('/users/',authMiddleware,getAllUsers);
router.post('/users/',authMiddleware,postUsers);
router.get('/user/:id',authMiddleware,getOneUser);
router.put('/user/:id',authMiddleware,putUser);
router.delete('/user/:id',authMiddleware,deleteUser);

module.exports = router;