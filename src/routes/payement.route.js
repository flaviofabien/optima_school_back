const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllPayement,postPayement,getOnePayement,deletePayement,putPayement} = require('../controllers/payement.controller');

router.get('/payements/',authMiddleware,getAllPayement);
router.post('/payements/',authMiddleware,postPayement);
router.get('/payement/:id',authMiddleware,getOnePayement);
router.put('/payement/:id',authMiddleware,putPayement);
router.delete('/payement/:id',authMiddleware,deletePayement);

module.exports = router;