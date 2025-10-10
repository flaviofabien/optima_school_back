const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllStudentExtendExamen,getAllStudents,postStudents,getOneStudent,deleteStudent,putStudent,getAllStudentsExamen} = require('../controllers/student.controller');
const upload = require("../middlewares/Storage.middleware");

router.get('/students/',authMiddleware,getAllStudents);
router.get('/students-examen/',authMiddleware,getAllStudentExtendExamen);
router.post('/students/',authMiddleware,upload.single('img'),postStudents);
router.get('/student/:id',authMiddleware,getOneStudent);
router.put('/student/:id',authMiddleware,upload.single('img'),putStudent);
router.delete('/student/:id',authMiddleware,deleteStudent);

module.exports = router;