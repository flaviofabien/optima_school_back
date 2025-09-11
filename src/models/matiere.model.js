const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Classe = require("./classes.model");

const Matiere = sequelize.define("Matiere", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idClasse: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Classe, 
      key: "id",
    },
    onDelete: "CASCADE",
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coefficiant: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  
});

Matiere.belongsTo(Classe, { foreignKey: "idClasse", onDelete: "CASCADE" });
Classe.hasMany(Matiere, { foreignKey: "idClasse" });

module.exports = Matiere;