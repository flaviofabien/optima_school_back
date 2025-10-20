const User = require('../models/user.model');
require('../constant/global');
const Payement = require('../models/payement.model');
const Ecole = require('../models/ecole.model');
const Student = require('../models/student.model');

exports.getAllPayement = async (req, res) => {
  try {
    const result = await Payement.findAll({
      include : [
        {
          model : Ecole,
          required : false,
        },
        {
          model : Student,
          required : false,
          include : {
              model : User ,
              required : false
          }
        }
    ]
    });

    res.json({
      message: 'Schools retrieved successfully',
      data: result
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students', error });
  }
};

exports.postPayement = async (req, res) => {
  try {
    const { idEcole ,  idStudent ,motif , prix , type } = req.body;

    const newUser = await Payement.create(
      {idEcole ,  idStudent ,motif , prix , type}
      );

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

exports.getOnePayement = async (req, res) => {
  try {
    const student = await Payement.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'student not found' });
    
    res.json({ message: 'student retrieved successfully', data: student });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student', error });
  }
};

exports.putPayement = async (req, res) => {
  try {
    const body = req.body;

    const [updated] = await Payement.update(body, { where: { id: req.params.id } });

    if (!updated) {
      return res.status(404).json({ message: 'École non trouvée ❌' });
    }

    const updatedEcole = await Payement.findByPk(req.params.id);
    res.status(200).json({ message: 'École mise à jour avec succès ✅', data: updatedEcole });

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

    res.status(500).json({ message: 'Erreur lors de la mise à jour de l’école', error });
  }
};

exports.deletePayement = async (req, res) => {
  try {
    const deleted = await Payement.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};