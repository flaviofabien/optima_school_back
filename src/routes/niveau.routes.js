const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllNiveaux,postNiveaux,getOneNiveau,deleteNiveau,putNiveau} = 
require('../controllers/niveau.controller');

router.get('/niveaux/',authMiddleware,getAllNiveaux);
router.post('/niveaux/',authMiddleware,postNiveaux);
router.get('/niveau/:id',authMiddleware,getOneNiveau);
router.put('/niveau/:id',authMiddleware,putNiveau);
router.delete('/niveau/:id',authMiddleware,deleteNiveau);

module.exports = router;