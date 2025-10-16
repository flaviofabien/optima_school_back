require('../constant/global');

const Salle = require('../models/salle.model');
const Student = require('../models/student.model');
const Classe = require('../models/classes.model');
const Ecole = require('../models/ecole.model');
const PartitionSalle = require('../models/partitionSalle.model');
const User = require('../models/user.model');

exports.getAllPartitionSalles = async (req, res) => {
  try {
    const partitionSalles = await PartitionSalle.findAll({
      include : [
      {
        model : Salle,
        required : false
      },
      {
        model : Student,
        as: 'students',
        include : {
          model : User,
          required : false
        },
        required : false,
        through: { attributes: [] } ,
      }
    ]
    });

    res.json({ message: 'PartitionSalle retrieved successfully', data: partitionSalles });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving PartitionSalle', error });
  }};


exports.postPartitionSalles = async (req, res) => {
  try {
    const { idSalle, idEleves } = req.body;

    if (!idSalle || !Array.isArray(idEleves)) {
      return res.status(400).json({ message: "Champs requis manquants ou invalides." });
    }

    const newPartitionSalle = await PartitionSalle.create({ idSalle });

    if (idEleves.length > 0) {
      await newPartitionSalle.addStudents(idEleves); 
    }

    res.status(201).json({
      message: 'Partition salle créé avec succès ✅',
      data: newPartitionSalle
    });

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

    res.status(500).json({
      message: 'Erreur lors de la création de l\'PartitionSalle',
      error: error.message
    });
  }
};


exports.getOnePartitionSalle = async (req, res) => {
  try {
    const partitionSalle = await PartitionSalle.findByPk(req.params.id);
    if (!partitionSalle) return res.status(404).json({ message: 'PartitionSalle not found' });
    
    res.json({ message: 'PartitionSalle retrieved successfully', data: partitionSalle });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving PartitionSalle', error });
  }
};

exports.putPartitionSalle = async (req, res) => {
  try {
    const { idEleves } = req.body;
    const updatedPartitionSalle = await PartitionSalle.findByPk(req.params.id);

    if (idEleves.length > 0) {
      await updatedPartitionSalle.setStudents(idEleves); 
    }

    res.json({ message: 'PartitionSalle updated successfully', data: updatedPartitionSalle });
  } catch (error) {
    res.status(500).json({ message: 'Error updating PartitionSalle', error });
  }
};

exports.deletePartitionSalle = async (req, res) => {
  try {
    const deleted = await PartitionSalle.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'PartitionSalle not found' });

    res.json({ message: 'PartitionSalle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting PartitionSalle', error });
  }
};