const Student = require('../models/student.model');
const Salle = require('../models/salle.model');
const { Op } = require('sequelize');
const Classe = require('../models/classes.model');
require('../constant/global');

exports.getAllStudentsExamen = async (req, res) => {
  try {
    const { idClasse } = req.query;
    if (!idClasse) {
      return res.status(400).json({ message: 'L\'ID de la classe est requis.' });
    }

    const students = await Student.findAll({ where: { idClasse: idClasse } });
    const salles = await Salle.findAll({ where: { idClasse: idClasse } });

    const shuffledStudents = students.sort(() => 0.5 - Math.random());

    let studentIndex = 0;

    const newStudentRooms = salles.map(salle => {
      const roomCapacity = salle.effectif;
      const studentsForThisRoom = [];

      for (let i = 0; i < roomCapacity && studentIndex < shuffledStudents.length; i++) {
        studentsForThisRoom.push(shuffledStudents[studentIndex].toJSON());
        studentIndex++;
      }

      return {
        salle: salle.nom,
        students: studentsForThisRoom
      };
    });

    res.json({ message: 'Affectation des étudiants réussie', data: newStudentRooms });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving students', error });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 6; 
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'nom'; 
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC'; 
    const search = req.query.search || ''; 

    const whereCondition = search ? {
         [Op.or]: [
             { nom: { [Op.like]: `%${search}%` } },
             { prenom: { [Op.like]: `%${search}%` } },
             { matricule: { [Op.like]: `%${search}%` } },
             { dateNaissance: { [Op.like]: `%${search}%` } },
             { sex: { [Op.like]: `%${search}%` } },
             { address: { [Op.like]: `%${search}%` } },
             { phone: { [Op.like]: `%${search}%` } },
             { email: { [Op.like]: `%${search}%` } },
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
      ],
    });

    console.log(result.rows);

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

exports.postStudents = async (req, res) => {
  try {
    const body = req.body;

    if (!req.file) return res.status(400).send('Aucun fichier téléchargé.');
    const file = req.file;
    const imageUrl = `/uploads/${file.filename}`;

    const newUser = await Student.create({
      ...body , img : imageUrl
    });
    

    res.status(201).json({ message: 'Utilisateur Cree avec succès ✅', data: newUser });
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

    let imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      body.img = imageUrl;
    }

    const [updated] = await Student.update(body, { where: { id: req.params.id } });

    if (updated === 0) {
      return res.status(404).json({ message: 'École non trouvée ❌' });
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