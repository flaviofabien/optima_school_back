const Teacher = require('../models/teacher.model');
require('../constant/global');
const User = require('../models/user.model');

exports.getAllTeachs = async (req, res) => {
  try {
    const students = await Teacher.findAll({include: [{model: User,required: true}] });
    res.json({ message: 'students retrieved successfully', data: students });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students', error });
  }
};

exports.postTeachs = async (req, res) => {
  try {
    const { userId  ,  specialite, sex, address , 
        phone , classes , status ,  } = req.body;

    const StudentUnique = await User.findByPk(userId);

    if (!StudentUnique) {
      return res.status(400).json({
        message: "identifiant de l'utilisateur est invalide."
      });
    }


    if (StudentUnique.role !== "Enseignant") return  res.status(400).json({
        message: "L'Enseignant n'existe pas dans la base de donner ??"
    });

    const newUser = await Teacher.create({
        userId  ,  specialite, sex, address , phone , classes , status
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

exports.getOneTeach = async (req, res) => {
  try {
    const student = await Teacher.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'student not found' });
    
    res.json({ message: 'student retrieved successfully', data: student });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student', error });
  }
};

exports.putTeach = async (req, res) => {
  try {
    const {userId , matricule ,  dateNaissance, sex, address , 
        phone , classes , status } = req.body;

    const [updated] = await Teacher.update({ userId , matricule ,  dateNaissance, sex, address , 
        phone , classes , status }, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await Teacher.findByPk(req.params.id);

    res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteTeach = async (req, res) => {
  try {
    const deleted = await Teacher.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};