const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllSalles,postSalles,getOneSalle,deleteSalle,putSalle,getAllSalleIncludeEcole} = require('../controllers/salle.controller');

router.get('/salles/',authMiddleware,getAllSalles);
router.get('/salles-include-ecole/',authMiddleware,getAllSalleIncludeEcole);
router.post('/salles/',authMiddleware,postSalles);
router.get('/salle/:id',authMiddleware,getOneSalle);
router.put('/salle/:id',authMiddleware,putSalle);
router.delete('/salle/:id',authMiddleware,deleteSalle);


module.exports = router;