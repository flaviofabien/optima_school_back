const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllTeachs,putTeach,getOneTeach,deleteTeach,postTeachs} = require('../controllers/teach.controller');

router.get('/teachs/',authMiddleware,getAllTeachs);
router.get('/teachs/',authMiddleware,getAllTeachs);
router.post('/teachs/',authMiddleware,postTeachs);
router.get('/teach/:id',authMiddleware,getOneTeach);
router.put('/teach/:id',authMiddleware,putTeach);
router.delete('/teach/:id',authMiddleware,deleteTeach);

module.exports = router;