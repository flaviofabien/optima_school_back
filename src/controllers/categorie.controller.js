const AnneeScolaire = require('../models/anneeScolaire.model');
const Categorie = require('../models/categorie.model');
const Niveaux = require('../models/niveau.model');
require('../constant/global');

exports.getAllCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findAll({
      include : [{
        model : Niveaux ,
        required : false
      },{
        model : AnneeScolaire,
        required : false
      }
    ]
    });

    res.json({ message: 'categorie retrieved successfully', data: categorie });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categorie', error });
  }
};


exports.postCategorie = async (req, res) => {
  try {
    const body = req.body;

    console.log(body);
  
    const newUser = await Categorie.create(body);

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

exports.getOneCategorie = async (req, res) => {
  try {
    const user = await Categorie.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User retrieved successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.putCategorie = async (req, res) => {
  try {
    const updateData = req.body;

    const [updated] = await Categorie.update(updateData, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await Categorie.findByPk(req.params.id);

    res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteCategorie = async (req, res) => {
  try {
    const deleted = await Categorie.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};