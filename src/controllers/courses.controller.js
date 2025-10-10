require('../constant/global');
const Classe = require('../models/classes.model');
const Cours = require('../models/courses.model');
const Ecole = require('../models/ecole.model');
const Matiere = require('../models/matiere.model');
const Salle = require('../models/salle.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const User = require('../models/user.model');

exports.getAllCourses = async (req, res) => {
  try {
    const users = await Cours.findAll({
      include: [ 
        { model: Salle,required: false, },
        { model: Teacher , include : [{
          model : User,required: false,
        }],required: false, },
        { model: Matiere,required: false, },
        { model: Classe,required: false, },
      ],
    });

    res.json({ message: 'Users retrieved successfully', data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

exports.getAllIncludeCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const classe = await Classe.findAll({
      include : [
        {
          model: Ecole,
          where: { idUser: userId },
          required: true, 
        },
      ],
    });
    const salle = await Salle.findAll(
      {
        include : [
          {
            model: Classe,
            required: true, 
          },
        ],
        
      }
    );
      const matiere = await Matiere.findAll({
        include : [
          {
            model: Classe,
            required: true, 
          },
        ],
      });
    const teacher = await Teacher.findAll();

    res.json({ message: 'Users retrieved successfully', data: {
      salle , teacher  , matiere , classe
    } });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

exports.postCourses = async (req, res) => {
  try {
    const { idSalle, idClasse ,idTeacher , idMatiere, jour, heureDebut, heureFin, salle } = req.body;

    const newCours = await Cours.create({
      idSalle,
      idMatiere,
      idTeacher,
      idClasse,
      jour,
      heureDebut,
      heureFin,
      salle
    });

    res.status(201).json({ message: 'Utilisateur Cree avec succès ✅', data: newCours });
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

exports.getOneCourse = async (req, res) => {
  try {
    const user = await Cours.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User retrieved successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.putCourse = async (req, res) => {
  try {
    const [updated] = await Cours.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'Ecole not found' });

    const updatedUser = await Cours.findByPk(req.params.id);

    res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const deleted = await Cours.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};