const Student = require('../models/student.model');
require('../constant/global');
const User = require('../models/user.model');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();

    res.json({ message: 'students retrieved successfully', data: students });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students', error });
  }
};

exports.postStudents = async (req, res) => {
  try {
    const { userId , matricule ,  dateNaissance, sex, address , 
        phone , classes , status } = req.body;

    const StudentUnique = await User.findByPk(userId);

    if (StudentUnique.role !== "élève") return  res.status(400).json({
        message: "L'etudiant n'existe pas dans la base de donner ??"
    });

    const newUser = await Student.create({
        userId , matricule ,  dateNaissance, sex, address , phone , classes , status
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

exports.getOneStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'student not found' });
    
    res.json({ message: 'student retrieved successfully', data: student });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student', error });
  }
};

exports.putStudent = async (req, res) => {
  try {
    const {userId , matricule ,  dateNaissance, sex, address , 
        phone , classes , status } = req.body;

    const [updated] = await Student.update({ userId , matricule ,  dateNaissance, sex, address , 
        phone , classes , status }, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await Student.findByPk(req.params.id);

    res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};