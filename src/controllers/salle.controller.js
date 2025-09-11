const Classe = require('../models/classes.model');
const Salle = require('../models/salle.model');
require('../constant/global');

exports.getAllSalles = async (req, res) => {
  try {
    const userId = req.user.id;

    const salles = await Salle.findAll({
        include: [
          {
            model: Classe,
            where: { idUser: userId },
            required: true, 
          },
        ],
      });

    res.json({ message: 'Salle retrieved successfully', data: salles });
  } catch (error) {
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
    const user = await Salle.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User retrieved successfully', data: user });
  } catch (error) {
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