const Student = require('../models/student.model');
const Examen = require('../models/examen.model');
const { Op } = require('sequelize');
const Classe = require('../models/classes.model');
const Niveau = require('../models/niveau.model');
const User = require('../models/user.model');
const bcrypt = require("bcrypt")
require('../constant/global');

exports.getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 6; 
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'sex'; 
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC'; 
    const search = req.query.search || ''; 

    const whereCondition = search ? {
         [Op.or]: [
             { dateNaissance: { [Op.like]: `%${search}%` } },
             { sex: { [Op.like]: `%${search}%` } },
             { address: { [Op.like]: `%${search}%` } },
             { phone: { [Op.like]: `%${search}%` } },
         ]
    } : {};

    const result = await Student.findAndCountAll({
      order: [[sortBy, order]],
      where: whereCondition,
      limit,
      offset,
      include: [
        {
          model: Classe,
          required: true,
        },
        {
          model: Niveau,
          required: true,
        },
        {
          model: User,
          required: true,
        },
      ],
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
    console.error(error);
    res.status(500).json({ message: 'Error retrieving students', error });
  }
};

exports.getAllStudentExtendExamen = async (req, res) => {
  try {
    const assignedExams = await Examen.findAll({
      attributes: [], 
      include: [
        {
          model: Student,
          as: 'students', 
          attributes: ['id'],
          through: { attributes: [] },
      include: [{
          model: User,
          required: true,
        },]
        },
         
      ],
    });

       const assignedStudentIds = assignedExams.flatMap(examen =>
        examen.students?.map(student => student.id) || []
      );
      
      const unassignedStudents = await Student.findAll({
        include: [
          {
            model: Classe,
            required: false, 
          },
          {
          model: User,
          required: true,
          },
        ],
        where: {
          id: {
            [Op.notIn]: assignedStudentIds
          }
        }
      });
  

    res.json({
      message: 'Student retrieved successfully',
      data:unassignedStudents ,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving students', error });
  }
};

exports.postStudents = async (req, res) => {
  try {
    const {email,password,role,prenom,nom,idClasse,idNiveau,idSalle,dateNaissance,sex,address,phone,status} = req.body;

    if (!req.file) return res.status(400).send('Aucun fichier téléchargé.');
    const file = req.file;
    const imageUrl = `/uploads/${file.filename}`;

    const newStudent = await Student.create(
      {idClasse,idNiveau,idSalle,dateNaissance,sex,address,phone,status} 
    );

    if (!newStudent)  return res.status(400).send('Aucun Etudiant cree.');
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nom , prenom , email, password: hashedPassword, role , img : imageUrl 
    });

    if (!newUser)  return res.status(400).send('Aucun Etudiant cree.');
    const finalStudent = await newStudent.update({ idUser: newUser.id });
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
    const body = req.body;

    const [updated] = await Student.update(body, { where: { id: req.params.id } });

    if (!updated) {
      return res.status(404).json({ message: 'Aucun modification ❌' });
    }

    const updatedEcole = await Student.findByPk(req.params.id);
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
exports.deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};