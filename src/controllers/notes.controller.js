const Matiere = require('../models/matiere.model');
const Notes = require('../models/notes.model');
const Salle = require('../models/salle.model');
const Student = require('../models/student.model');
require('../constant/global');

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Notes.findAll({
      include : [ 
        {
        model : Student,
        required : false 
        },
        {
        model : Matiere,
        required : false 
        },
        {
        model : Salle,
        required : false 
        },
      ]
    });

    res.json({ message: 'Notes retrieved successfully', data: notes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving notes', error });
  }
};


exports.postNotes = async (req, res) => {
  try {
    const { idStudent , note , idSalle ,  idMatiere } = req.body;
  
    const newUser = await Notes.create({
        idStudent , note , idSalle , idMatiere
    });

    res.status(201).json({ message: 'Utilisateur Cree avec succès ✅', data: newUser });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ 
        message: error.errors[0].message || "Contrainte unique violée" 
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ 
        message: error.errors.map(e => e.message) 
      });
    }
  
    res.status(500).json({ message: 'Error creating user', error });
  }
};

exports.getOneNote = async (req, res) => {
  try {
    const notes = await Notes.findByPk(req.params.id);
    if (!notes) return res.status(404).json({ message: 'notes not found' });
    
    res.json({ message: 'notes retrieved successfully', data: notes });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.putNote = async (req, res) => {
  try {
    const updateData = req.body;

    const [updated] = await Notes.update(updateData, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await Notes.findByPk(req.params.id);

    res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const deleted = await Notes.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};