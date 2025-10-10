require('../constant/global');

const Salle = require('../models/salle.model');
const Student = require('../models/student.model');
const Examen = require('../models/examen.model');
const Classe = require('../models/classes.model');
const Ecole = require('../models/ecole.model');

exports.getAllExamens = async (req, res) => {
  try {
    const examens = await Examen.findAll({
      include: [ 
        { 
          model: Salle, 
          required: false ,
          include : {
            model : Classe,
            required : false,
            include : {
              model : Ecole,
              required : false
            },
          },
        },
        { 
          model: Student, 
          include : {
            model : Classe,
            required : false
          },
          as: 'students',
          through: { attributes: [] } 
        },
      ],
    });

    res.json({ message: 'Examen retrieved successfully', data: examens });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving Examen', error });
  }
};


exports.postExamens = async (req, res) => {
  try {
    const { idSalle, idEleves, nom } = req.body;

    if (!idSalle || !nom || !Array.isArray(idEleves)) {
      return res.status(400).json({ message: "Champs requis manquants ou invalides." });
    }

    const newExamen = await Examen.create({
      idSalle,
      nom
    });


    if (idEleves.length > 0) {
      await newExamen.addStudents(idEleves); 
    }

    res.status(201).json({
      message: 'Examen créé avec succès ✅',
      data: newExamen
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
      message: 'Erreur lors de la création de l\'examen',
      error: error.message
    });
  }
};


exports.getOneExamen = async (req, res) => {
  try {
    const examen = await Examen.findByPk(req.params.id);
    if (!examen) return res.status(404).json({ message: 'Examen not found' });
    
    res.json({ message: 'Examen retrieved successfully', data: examen });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving Examen', error });
  }
};

exports.putExamen = async (req, res) => {
  try {
    const [updated] = await Examen.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'Ecole not found' });

    const updatedExamen = await Examen.findByPk(req.params.id);

    res.json({ message: 'Examen updated successfully', data: updatedExamen });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Examen', error });
  }
};

exports.deleteExamen = async (req, res) => {
  try {
    const deleted = await Examen.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Examen not found' });

    res.json({ message: 'Examen deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Examen', error });
  }
};