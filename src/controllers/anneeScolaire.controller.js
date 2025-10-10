const AnneeScolaire = require('../models/anneeScolaire.model');
const Ecole = require('../models/ecole.model');

require('../constant/global');

exports.getAllAnneeScolaires = async (req, res) => {
  try {
    const userId = req.user.id;
    const anneeScolaire = await AnneeScolaire.findAll({
        include : {                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            model : Ecole,
            // where : { idUser: userId },
            required : false
        }
    });

    res.json({ message: 'AnneeScolaire retrieved successfully', data: anneeScolaire });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving AnneeScolaire', error });
  }
};


exports.postAnneeScolaires = async (req, res) => {
  try {
    const { nom , dateDebut , dateFin , idEcole } = req.body;
  
    const newUser = await AnneeScolaire.create({
        nom , dateDebut , dateFin , idEcole 
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

exports.getOneAnneeScolaire = async (req, res) => {
  try {
    const user = await AnneeScolaire.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User retrieved successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.putAnneeScolaire = async (req, res) => {
  try {
    const updateData = req.body;

    const [updated] = await AnneeScolaire.update(updateData, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'User not found' });

    const updatedUser = await AnneeScolaire.findByPk(req.params.id);
    res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteAnneeScolaire = async (req, res) => {
  try {
    const deleted = await AnneeScolaire.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};