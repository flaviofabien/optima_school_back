const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllPartitionSalles,getOnePartitionSalle,postPartitionSalles,deletePartitionSalle,putPartitionSalle} = require('../controllers/partition-salle.controller');

router.get('/partition-salles/',authMiddleware,getAllPartitionSalles);
router.post('/partition-salles/',authMiddleware,postPartitionSalles);
router.get('/partition-salle/:id',authMiddleware,getOnePartitionSalle);
router.put('/partition-salle/:id',authMiddleware,putPartitionSalle);
router.delete('/partition-salle/:id',authMiddleware,deletePartitionSalle);

module.exports = router;