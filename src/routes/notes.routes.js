const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {getAllNotes,postNotes,getOneNote,deleteNote,putNote} = require('../controllers/notes.controller');

router.get('/notes/',authMiddleware,getAllNotes);
router.post('/notes/',authMiddleware,postNotes);
router.get('/note/:id',authMiddleware,getOneNote);
router.put('/note/:id',authMiddleware,putNote);
router.delete('/note/:id',authMiddleware,deleteNote);

module.exports = router;