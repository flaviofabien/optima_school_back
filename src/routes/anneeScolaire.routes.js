const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {deleteAnneeScolaire,getAllAnneeScolaires,getOneAnneeScolaire,postAnneeScolaires,putAnneeScolaire} = 
require('../controllers/anneeScolaire.controller');

router.get('/annee-scolaires/',authMiddleware,getAllAnneeScolaires);
router.post('/annee-scolaires/',authMiddleware,postAnneeScolaires);
router.get('/annee-scolaire/:id',authMiddleware,getOneAnneeScolaire);
router.put('/annee-scolaire/:id',authMiddleware,putAnneeScolaire);
router.delete('/annee-scolaire/:id',authMiddleware,deleteAnneeScolaire);

module.exports = router;