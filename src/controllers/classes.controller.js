const Classe = require('../models/classes.model');
const Ecole = require('../models/ecole.model');
require('../constant/global');

exports.getAllClasses = async (req, res) => {
  try {
    const userId = req.user.id;
    const classe = await Classe.findAll({
      include: [{ model: Ecole , required: false }],
      where: { idUser: userId }
    });

    res.json({ message: 'classe retrieved successfully', data: classe });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

exports.postClasses = async (req, res) => {
  try {
    const {idEcole ,  nom , idUser } = req.body;

    const ecole = await Ecole.findByPk(idEcole);

    if (!ecole) {
        return res.status(400).json({
          message: "l'ecole n'existe pas."
        });
      }
    if (!idUser) {
        return res.status(400).json({
          message: "idUser n'existe pas."
        });
      }
  
    const newUser = await Classe.create({
        idEcole ,  nom , idUser
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