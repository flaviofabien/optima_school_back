const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllTeachs,putTeach,getOneTeach,deleteTeach,postTeachs} = require('../controllers/teach.controller');
const upload = require("../middlewares/Storage.middleware");

// router.get('/teachs/',authMiddleware,getAllTeachs);
// router.get('/teachs/',authMiddleware,getAllTeachs);
// router.post('/teachs/',authMiddleware,postTeachs);
// router.get('/teach/:id',authMiddleware,getOneTeach);
// router.put('/teach/:id',authMiddleware,putTeach);
// router.delete('/teach/:id',authMiddleware,deleteTeach);
router.get('/teachs/',getAllTeachs);
router.get('/teachs/',getAllTeachs);
router.post('/teachs/',upload.single('img'),postTeachs);
router.get('/teach/:id',getOneTeach);
router.put('/teach/:id',upload.single('img'),putTeach);
router.delete('/teach/:id',deleteTeach);

module.exports = router;