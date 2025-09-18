const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Teacher = require("./teacher.model");
const Salle = require("./salle.model");
const Matiere = require("./matiere.model");
const Classe = require("./classes.model");

const Cours = sequelize.define("Cours", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idSalle: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Salle, 
      key: "id",
    },
    onDelete: "CASCADE",
  },
  idClasse: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Classe, 
      key: "id",
    },
    onDelete: "CASCADE",
  },
  idMatiere: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Matiere, 
      key: "id",
    },
    onDelete: "CASCADE",
  },
  idTeacher: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Teacher, 
      key: "id",
    },
    onDelete: "CASCADE",
  },
  jour: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  heureDebut: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  heureFin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Cours.belongsTo(Salle, { foreignKey: "idSalle", onDelete: "CASCADE" });
Salle.hasMany(Cours, { foreignKey: "idSalle" });

Cours.belongsTo(Matiere, { foreignKey: "idMatiere", onDelete: "CASCADE" });
Matiere.hasMany(Cours, { foreignKey: "idMatiere" });

Cours.belongsTo(Classe, { foreignKey: "idClasse", onDelete: "CASCADE" });
Classe.hasMany(Cours, { foreignKey: "idClasse" });

Cours.belongsTo(Teacher, { foreignKey: "idTeacher", onDelete: "CASCADE" });
Teacher.hasMany(Cours, { foreignKey: "idTeacher" });

module.exports = Cours;