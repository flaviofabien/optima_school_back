const Classe = require('../models/classes.model');
const Ecole = require('../models/ecole.model');
const Niveaux = require('../models/niveau.model');
const Salle = require('../models/salle.model');
const Categorie = require('../models/categorie.model');
const AnneeScolaire = require('../models/anneeScolaire.model');
const Matiere = require('../models/matiere.model');
const Teacher = require('../models/teacher.model');
const User = require('../models/user.model');
require('../constant/global');

exports.getAllSalles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 5; 
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'nom'; 
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC'; 
    const search = req.query.search || ''; 

    const whereCondition = search ? {
      [Op.or]: [
        { nom: { [Op.iLike]: `%${search}%` } }, 
        { effectif: { [Op.iLike]: `%${search}%` } }, 
        { '$Classe.nom$': { [Op.iLike]: `%${search}%` } } 
      ]
    } : {};

    let orderClause;
    if (sortBy === 'classe') {
      orderClause = [[{ model: Classe }, 'nom', order]];
    } else {
      orderClause = [[sortBy, order]];
    }

    let includeOptions = {
      model: Classe,
      required: false,
    };
    if (search || sortBy === 'classe') {
      includeOptions.required = true;
    }


    const result = await Salle.findAndCountAll({
        order: orderClause,
        include: [includeOptions],
        where: whereCondition,
        limit,
        offset
      });

    res.json({
      message: 'Salles retrieved successfully',
      data: result.rows,
      totalItems: result.count,
      totalPages: Math.ceil(result.count / limit),
      currentPage: page,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving Salle', error });
  }
};


exports.getAllSalleIncludeEcole = async (req, res) => {
  try {
    const salle = await Salle.findAll();
    const classe = await Classe.findAll();
    const niveau = await Niveaux.findAll({
      include : [
        {
          model: Ecole,
          as: "ecoles",   
        }
      ]
    });
    const ecole = await Ecole.findAll({
      include : [{
        model :Classe,
        required : false
      }]
    });
    const categorie = await Categorie.findAll();
    const anneeScolaire = await AnneeScolaire.findAll();
    const matiere = await Matiere.findAll();
    const teacher = await Teacher.findAll({
      include : [{
        model : User,
        required : false
      }]
    });

    res.json({ message: 'Examen retrieved successfully', data: {
      salle , classe , niveau , ecole , categorie , anneeScolaire , matiere , teacher
    } });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving Salle', error });
  }
};

exports.postSalles = async (req, res) => {
  try {
    const {idClasse ,  effectif , nom } = req.body;

    const classe = await Classe.findByPk(idClasse);

    if (!classe) {
        return res.status(400).json({
          message: "l'Classe nexiste pas."
        });
      }
  
    const newUser = await Salle.create({
        idClasse ,  nom , effectif
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

exports.getOneSalle = async (req, res) => {
  try {
    const user = await Salle.findByPk(req.params.id , {
      include : [
        {
        model : Classe,
        required : false,
        }]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User retrieved successfully', data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.putSalle = async (req, res) => {
  try {
    const updateData = req.body;

    const [updated] = await Salle.update(updateData, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await Salle.findByPk(req.params.id);

    res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteSalle = async (req, res) => {
  try {
    const deleted = await Salle.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};