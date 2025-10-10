const { Op } = require('sequelize');
const Teacher = require('../models/teacher.model');
const User = require('../models/user.model');
require('../constant/global');
const bcrypt = require("bcrypt");
const Matiere = require('../models/matiere.model');
const Classe = require('../models/classes.model');

exports.getAllTeachs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 6; 
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'sex'; 
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC'; 
    const search = req.query.search || ''; 

    const whereCondition = search ? {
         [Op.or]: [
          { matricule: { [Op.like]: `%${search}%` } },
          { dateNaissance: { [Op.like]: `%${search}%` } },
          { sex: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
         ]
    } : {};

    const result = await Teacher.findAndCountAll({
      order: [[sortBy, order]],
      where: whereCondition,
      include : [
        {
          model : Matiere,
          require : false
        },
        {
          model : Classe,
          require : false
        },
        
        {
          model : User,
          require : false
        },

    ], 
      limit,
      offset,
    });

    const totalItems = result.count;
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      message: 'Schools retrieved successfully',
      data: result.rows,
      totalItems,
      totalPages,
      currentPage: page,
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students', error });
  }
};

exports.postTeachs = async (req, res) => {
  try {
    const {email,password,role,prenom,nom,idClasse,idMatiere,sex,address,phone,status,specialite} = req.body;

    if (!req.file) return res.status(400).send('Aucun fichier téléchargé.');
    const file = req.file;
    const imageUrl = `/uploads/${file.filename}`;

    /* create teacher */
    const newTeacher = await Teacher.create(
      {idClasse,idMatiere,sex,address,phone,status,specialite} 
    );

    if (!newTeacher)  return res.status(400).send('Aucun Etudiant cree.');

    /* create account */
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nom , prenom , email, password: hashedPassword, role , img : imageUrl 
    });

    if (!newUser)  return res.status(400).send('Aucun Etudiant cree.');
    const finalStudent = await newTeacher.update({ idUser: newUser.id });
    if (!finalStudent)  return res.status(400).send('final ne fonctionne pas ');

    res.status(201).json({ message: 'Utilisateur Cree avec succès ✅', data: finalStudent });
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
    const body = req.body;

    let imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      body.img = imageUrl;
    }

    const [updated] = await Teacher.update(body, { where: { id: req.params.id } });

    if (updated === 0) {
      return res.status(404).json({ message: 'École non trouvée ❌' });
    }

    const updatedEcole = await Teacher.findByPk(req.params.id);
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

exports.deleteTeach = async (req, res) => {
  try {
    const deleted = await Teacher.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};