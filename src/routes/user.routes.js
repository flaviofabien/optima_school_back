const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllUsers,getOneUser,putUser,deleteUser,postUsers,getAllStudentUsers,getAllTeachUsers} = require('../controllers/user.controller');
const upload = require("../middlewares/Storage.middleware");

router.get('/users/',authMiddleware,getAllUsers);
router.get('/users/student',authMiddleware,getAllStudentUsers);
router.get('/users/teach',authMiddleware,getAllTeachUsers);
router.post('/users/',upload.single('img'),postUsers);
router.get('/user/:id',authMiddleware,getOneUser);
router.put('/user/:id',upload.single('img'),authMiddleware,putUser);
router.delete('/user/:id',authMiddleware,deleteUser);

module.exports = router;