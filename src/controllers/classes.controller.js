const { Op } = require('sequelize');
const Classe = require('../models/classes.model');
const Ecole = require('../models/ecole.model');
const Niveaux = require('../models/niveau.model');
require('../constant/global');

exports.getAllClasses = async (req, res) => {
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
        { '$Ecole.nom$': { [Op.iLike]: `%${search}%` } } 
      ]
    } : {};

    let orderClause;
    if (sortBy === 'ecole') {
      orderClause = [[{ model: Ecole }, 'nom', order]];
    } else {
      orderClause = [[sortBy, order]];
    }

    let includeOptions = {
      model: Ecole,
      required: false,
    };
    if (search || sortBy === 'ecole') {
      includeOptions.required = true;
    }

    const result = await Classe.findAndCountAll({
      order: orderClause,
      include: [includeOptions,{
        model: Niveaux,
        required: false,
      }],
      where: whereCondition,
      limit,
      offset
    });
    
    res.json({
      message: 'classes retrieved successfully',
      data: result.rows,
      totalItems: result.count,
      totalPages: Math.ceil(result.count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving classes', error });
  }
};


exports.postClasses = async (req, res) => {
  try {
    const {idEcole ,  nom , idNiveau } = req.body;

    const ecole = await Ecole.findByPk(idEcole);

    if (!ecole) {
        return res.status(400).json({
          message: "l'ecole n'existe pas."
        });
    }

    const niveau = await Niveaux.findByPk(idNiveau);

    if (!niveau) {
        return res.status(400).json({
          message: "niveau n'existe pas."
        });
    }

    const newUser = await Classe.create({
        idEcole ,  nom , idNiveau
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

exports.getOneClasse = async (req, res) => {
  try {
    const user = await Classe.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User retrieved successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.putClasse = async (req, res) => {
  try {
    const updateData = req.body;

    const [updated] = await Classe.update(updateData, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await Classe.findByPk(req.params.id);

    res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteClasse = async (req, res) => {
  try {
    const deleted = await Classe.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};