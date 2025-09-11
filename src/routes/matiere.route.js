const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllMatieres,postMatieres,getOneMatiere,deleteMatiere,putMatiere} = require('../controllers/matiere.controller');

router.get('/matieres/',authMiddleware,getAllMatieres);
router.post('/matieres/',authMiddleware,postMatieres);
router.get('/matiere/:id',authMiddleware,getOneMatiere);
router.put('/matiere/:id',authMiddleware,putMatiere);
router.delete('/matiere/:id',authMiddleware,deleteMatiere);

module.exports = router;