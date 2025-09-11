const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllStudents,postStudents,getOneStudent,deleteStudent,putStudent,getAllStudentsExamen} = require('../controllers/student.controller');
const upload = require("../middlewares/Storage.middleware");

router.get('/partition-examen/',authMiddleware,getAllStudentsExamen);
router.get('/students/',authMiddleware,getAllStudents);
router.post('/students/',authMiddleware,upload.single('img'),postStudents);
router.get('/student/:id',authMiddleware,getOneStudent);
router.put('/student/:id',authMiddleware,upload.single('img'),putStudent);
router.delete('/student/:id',authMiddleware,deleteStudent);

module.exports = router;