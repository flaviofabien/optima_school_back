const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllAbsence , postAbsence , getOneAbsence , putAbsence , deleteAbsence} = 
require('../controllers/absense.controller');

router.get('/absences/',authMiddleware,getAllAbsence);
router.post('/absences/',authMiddleware,postAbsence);
router.get('/absence/:id',authMiddleware,getOneAbsence);
router.put('/absence/:id',authMiddleware,putAbsence);
router.delete('/absence/:id',authMiddleware,deleteAbsence);

module.exports = router;