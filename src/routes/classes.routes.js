const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllClasses,getOneClasse,putClasse,deleteClasse,postClasses} = require('../controllers/classes.controller');

router.get('/classes/',authMiddleware,getAllClasses);
router.post('/classes/',authMiddleware,postClasses);
router.get('/classe/:id',authMiddleware,getOneClasse);
router.put('/classe/:id',authMiddleware,putClasse);
router.delete('/classe/:id',authMiddleware,deleteClasse);

module.exports = router;