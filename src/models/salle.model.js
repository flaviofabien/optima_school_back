const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Classe = require("./classes.model");

const Salle = sequelize.define("Salle", {
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
  effectif: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
});

Salle.belongsTo(Classe, { foreignKey: "idClasse", onDelete: "CASCADE" });
Classe.hasMany(Salle, { foreignKey: "idClasse" });

module.exports = Salle;