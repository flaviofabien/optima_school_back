const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const User = require('../models/user.model');
require('../constant/global');
const bcrypt = require("bcrypt")

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.json({ message: 'Users retrieved successfully', data: users });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

exports.getAllStudentUsers = async (req, res) => {
  try {
    const usersNotStudent = await User.findAll({
      where: { role: "élève" },
      include: [ { model: Student,required: false, },],
      where: {
        role: "élève",
        "$Student.id$": null,
      },
    });

    res.json({ message: "Users retrieved successfully", data: usersNotStudent,});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving users", error });
  }
}

exports.getAllTeachUsers = async (req, res) => {
  try {
    const usersNotTeach = await User.findAll({
      where: { role: "Enseignant" },
      include: [ { model: Teacher,required: false, },],
      where: {
        role: "Enseignant",
        "$Teacher.id$": null,
      },
    });

    res.json({ message: "Users retrieved successfully", data: usersNotTeach,});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving users", error });
  }
}


exports.postUsers = async (req, res) => {
  try {
    const { nom ,prenom ,  email, password, role } = req.body;
    
    console.log(nom ,prenom ,  email, password, role );
    if (role !== "admin" )  {
      return  res.status(404).json({ 
        message: "Role doit etre dans admin  ", 
      });
    } 
    
    if (!req.file) return res.status(400).send('Aucun fichier téléchargé.');
    const file = req.file;
    const imageUrl = `/uploads/${file.filename}`;

    if (!REGEX.test(password)) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nom , prenom , email, password: hashedPassword, role , img : imageUrl 
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

exports.getOneUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User retrieved successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.putUser = async (req, res) => {
  try {
    const body = req.body;

    let imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      body.img = imageUrl;
    }

    const [updated] = await User.update(body, { where: { id: req.params.id } })

    if (updated === 0) return res.status(404).json({ message: 'École non trouvée ❌' });

    const updatedEcole = await User.findByPk(req.params.id);
    res.status(200).json({ message: 'École mise à jour avec succès ✅', data: updatedEcole });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};