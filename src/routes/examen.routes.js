const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllExamens,getOneExamen,putExamen,deleteExamen,postExamens} = require('../controllers/examen.controller');

router.get('/examens/',authMiddleware,getAllExamens);
router.post('/examens/',authMiddleware,postExamens);
router.get('/examen/:id',authMiddleware,getOneExamen);
router.put('/examen/:id',authMiddleware,putExamen);
router.delete('/examen/:id',authMiddleware,deleteExamen);

module.exports = router;