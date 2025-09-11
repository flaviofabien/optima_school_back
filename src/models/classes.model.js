const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Ecole = require("./ecole.model");
const User = require("./user.model");

const Classe = sequelize.define("Classe", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idEcole: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Ecole, 
      key: "id",
    },
    onDelete: "CASCADE",
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, 
      key: "id",
    },
    onDelete: "CASCADE",
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Classe.belongsTo(Ecole, { foreignKey: "idEcole", onDelete: "CASCADE" });
Ecole.hasMany(Classe, { foreignKey: "idEcole" });

module.exports = Classe;