require('../constant/global');
const { Op } = require('sequelize');
const Ecole = require('../models/ecole.model');

exports.getAllEcoles = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 3; 
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'nom'; 
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC'; 
    const search = req.query.search || ''; 

    const whereCondition = search ? {
         [Op.or]: [
             { nom: { [Op.iLike]: `%${search}%` } },
             { adresse: { [Op.iLike]: `%${search}%` } },
         ]
    } : {};

    const result = await Ecole.findAndCountAll({
      order: [[sortBy, order]],
      where: {...whereCondition,idUser: userId },
      limit,
      offset,
    });


    const data = result.rows.map(record => {
      const obj = record.toJSON();

      if (typeof obj.type === 'string') {
        try {
          obj.type = JSON.parse(obj.type);
        } catch (err) {
          console.warn('Erreur parsing type:', obj.type);
        }
      }

      return obj;
    });
    const totalItems = result.count;
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      message: 'Schools retrieved successfully',
      data,
      totalItems,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

exports.postEcoles = async (req, res) => {
  try {
    const body = req.body;

    if (!req.file) return res.status(400).send('Aucun fichier téléchargé.');
    const file = req.file;
    const imageUrl = `/uploads/${file.filename}`;

    const newUser = await Ecole.create({
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

exports.getOneEcole = async (req, res) => {
  try {
    const user = await Ecole.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User retrieved successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.putEcole = async (req, res) => {
  try {
    const body = req.body;

    let imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      body.img = imageUrl;
    }

    const [updated] = await Ecole.update(body, { where: { id: req.params.id } });

    if (updated === 0) {
      return res.status(404).json({ message: 'École non trouvée ❌' });
    }

    const updatedEcole = await Ecole.findByPk(req.params.id);
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


exports.deleteEcole = async (req, res) => {
  try {
    const deleted = await Ecole.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};