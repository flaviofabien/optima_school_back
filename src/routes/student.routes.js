const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllStudents,putStudent,getOneStudent,deleteStudent,postStudents} = require('../controllers/student.controller');

router.get('/students/',authMiddleware,getAllStudents);
router.post('/students/',authMiddleware,postStudents);
router.get('/student/:id',authMiddleware,getOneStudent);
router.put('/student/:id',authMiddleware,putStudent);
router.delete('/student/:id',authMiddleware,deleteStudent);

module.exports = router;