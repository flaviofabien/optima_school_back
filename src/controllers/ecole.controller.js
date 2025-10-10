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
      include: ["niveaux"],
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
    console.log(error);
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

    console.log(body.idNiveaux);
    if ( (JSON.parse(body.idNiveaux)).length > 0) {
      await newUser.addNiveaux(JSON.parse(body.idNiveaux)); 
    } else return res.status(400).send('Aucun Niveaux.');
  
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

exports.getOneEcole = async (req, res) => {
  try {
    const user = await Ecole.findByPk(req.params.id, {
      include: [{
        association: "niveaux",  
        through: { attributes: [] } 
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'École non trouvée ❌' });
    }

    let obj = user.toJSON();

    if (typeof obj.type === 'string') {
      try {
        obj.type = JSON.parse(obj.type);
      } catch (err) {
        console.warn('Erreur parsing type:', obj.type);
      }
    }

    res.json({ message: 'École récupérée avec succès ✅', data: obj });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l’école ❌', error });
  }
};


exports.putEcole = async (req, res) => {
  try {
    const body = req.body;

    if (req.file) {
      body.img = `/uploads/${req.file.filename}`;
    }

    if (!body.idNiveaux) {
      return res.status(400).json({ message: "Le champ idNiveaux est obligatoire ❌" });
    }

    const [updatedCount] = await Ecole.update(body, { where: { id: req.params.id } });

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'École non trouvée ❌' });
    }

    const updatedEcole = await Ecole.findByPk(req.params.id);
    if (!updatedEcole) {
      return res.status(404).json({ message: 'École non trouvée après update ❌' });
    }

    let niveauxArray;
    try {
      niveauxArray = JSON.parse(body.idNiveaux); 
    } catch (err) {
      return res.status(400).json({ message: "Le champ idNiveaux doit être un JSON valide ❌" });
    }

    if (!Array.isArray(niveauxArray) || niveauxArray.length === 0) {
      return res.status(400).json({ message: "Vous devez sélectionner au moins un niveau ❌" });
    }

    const niveauxIds = niveauxArray
      .map(id => parseInt(id))
      .filter(id => !isNaN(id));

    if (niveauxIds.length === 0) {
      return res.status(400).json({ message: "Les identifiants des niveaux ne sont pas valides ❌" });
    }

    await updatedEcole.setNiveaux(niveauxIds);

    const ecoleWithNiveaux = await Ecole.findByPk(req.params.id, {
      include: [{
        association: "niveaux",
        attributes: ["id", "nom"],
        through: { attributes: [] }
      }]
    });

    res.status(200).json({ message: 'École mise à jour avec succès ✅', data: ecoleWithNiveaux });

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