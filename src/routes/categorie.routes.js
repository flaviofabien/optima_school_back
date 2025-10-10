const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {deleteCategorie,getAllCategorie,getOneCategorie,postCategorie,putCategorie} = 
require('../controllers/categorie.controller');

router.get('/categories/',authMiddleware,getAllCategorie);
router.post('/categories/',authMiddleware,postCategorie);
router.get('/categorie/:id',authMiddleware,getOneCategorie);
router.put('/categorie/:id',authMiddleware,putCategorie);
router.delete('/categorie/:id',authMiddleware,deleteCategorie);

module.exports = router;