const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Ecole = require("./ecole.model");

const Niveaux = sequelize.define("Niveaux", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Niveaux.belongsToMany(Ecole, {
  through: 'NiveauEcole',
  foreignKey: 'idNiveau',    
  otherKey: 'idEcole',      
  as: 'ecoles',
  onDelete: 'CASCADE'
});
Ecole.belongsToMany(Niveaux, {
  through: 'NiveauEcole',
  foreignKey: 'idEcole',   
  otherKey: 'idNiveau',      
  as: 'niveaux',
  onDelete: 'CASCADE'
});

module.exports = Niveaux;