const { Op } = require('sequelize');
const Niveau = require('../models/niveau.model');
const Ecole = require('../models/ecole.model');
require('../constant/global');

exports.getAllNiveaux = async (req, res) => {
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
      ]
    } : {};

    const result = await Niveau.findAndCountAll({
      order: [[sortBy, order]],
      where: whereCondition,
      include: [
        {
          model: Ecole,
          as: "ecoles",   
          through: { attributes: [] } 
        }
      ],
      limit,
      offset
    });
    
    res.json({
      message: 'Niveaus retrieved successfully',
      data: result.rows,
      totalItems: result.count,
      totalPages: Math.ceil(result.count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error retrieving Niveaus', error });
  }
};


exports.postNiveaux = async (req, res) => {
  try {
    const { nom  } = req.body;
  
    const newUser = await Niveau.create({
         nom
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

exports.getOneNiveau = async (req, res) => {
  try {
    const user = await Niveau.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User retrieved successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.putNiveau = async (req, res) => {
  try {
    const updateData = req.body;

    const [updated] = await Niveau.update(updateData, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await Niveau.findByPk(req.params.id);

    res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteNiveau = async (req, res) => {
  try {
    const deleted = await Niveau.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};