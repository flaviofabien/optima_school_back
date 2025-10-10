require('../constant/global');
const Classe = require('../models/classes.model');
const Matiere = require('../models/matiere.model');

exports.getAllMatieres = async (req, res) => {
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
        { coefficiant: { [Op.iLike]: `%${search}%` } }, 
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


    const result = await Matiere.findAndCountAll({
      order: orderClause,
      include: [includeOptions],
      where: whereCondition,
      limit,
      offset
    });

    res.json({
          message: 'Matriere retrieved successfully',
          data: result.rows,
          totalItems: result.count,
          totalPages: Math.ceil(result.count / limit),
          currentPage: page,
        });

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error retrieving Salle', error });
  }
}


exports.postMatieres = async (req, res) => {
  try {
    const { idClasse ,nom , coefficiant } = req.body;

    const user = await Classe.findByPk(idClasse);
    if (!user) return res.status(404).json({ message: 'Classe not found' });
    

    const newUser = await Matiere.create({
      idClasse , nom , coefficiant
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

exports.getOneMatiere = async (req, res) => {
  try {
    const user = await Matiere.findByPk(req.params.id , {
      include : [
        {
        model : Classe,
        required : false,
        }]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User retrieved successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

exports.putMatiere = async (req, res) => {
  try {
    const [updated] = await Matiere.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'Matiere not found' });

    const updatedUser = await Matiere.findByPk(req.params.id);

    res.json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

exports.deleteMatiere = async (req, res) => {
  try {
    const deleted = await Matiere.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};