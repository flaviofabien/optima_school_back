const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Ecole = require("./ecole.model");
const Niveau = require("./niveau.model");

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
  idNiveau: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Niveau, 
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

Classe.belongsTo(Niveau, { foreignKey: "idNiveau", onDelete: "CASCADE" });
Niveau.hasMany(Classe, { foreignKey: "idNiveau" });

module.exports = Classe;