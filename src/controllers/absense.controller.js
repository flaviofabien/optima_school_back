const Student = require('../models/student.model');
require('../constant/global');
const bcrypt = require("bcrypt");
const Absence = require('../models/absense.model');
const User = require('../models/user.model');

exports.getAllAbsence = async (req, res) => {
  try {
    const absence = await Absence.findAll({
      include : [{
        model : Student,
        required : false,
        include : {
          model : User ,
          required : false
        }
      }]
    });

    res.json({ message: 'absence retrieved successfully', data: absence });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

exports.postAbsence = async (req, res) => {
  try {
    const { motif , dateDebut , dateFin , heurDebut , heurFin , idStudent } = req.body;
    
    const newUser = await Absence.create({
      motif , dateDebut , dateFin , heurDebut , heurFin , idStudent
    });

    res.status(201).json({ message: 'Utilisateur Cree avec succès ✅', data: newUser });
  } catch (error) {
    console.log(error);
    
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

exports.getOneAbsence = async (req, res) => {
  try {
    const user = await Absence.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User retrieved successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.putAbsence = async (req, res) => {
  try {
    const body = req.body;
    const [updated] = await Absence.update(body, { where: { id: req.params.id } })

    if (!updated) return res.status(404).json({ message: 'École non trouvée ❌' });

    const updatedEcole = await Absence.findByPk(req.params.id);
    res.status(200).json({ message: 'École mise à jour avec succès ✅', data: updatedEcole });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteAbsence = async (req, res) => {
  try {
    const deleted = await Absence.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};