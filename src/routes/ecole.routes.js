const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllEcoles,getOneEcole,putEcole,deleteEcole,postEcoles} = require('../controllers/ecole.controller');
const upload = require("../middlewares/Storage.middleware");

router.get('/ecoles/',authMiddleware,getAllEcoles);
router.post('/ecoles/',upload.single('img'),authMiddleware,postEcoles);
router.get('/ecole/:id',authMiddleware,getOneEcole);
router.put('/ecole/:id',upload.single('img'),authMiddleware,putEcole);
router.delete('/ecole/:id',authMiddleware,deleteEcole);


module.exports = router;