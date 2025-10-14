const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Salle = require("./salle.model");
const Student = require("./student.model");
const Categorie = require("./categorie.model");

const Examen = sequelize.define("Examen", {
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
  idCategorie: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Categorie, 
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

Examen.belongsToMany(Student, {
  through: 'StudentExamens',
  foreignKey: 'idExamen',    
  otherKey: 'idStudent',      
  as: 'students',
  onDelete: 'CASCADE'
});

Student.belongsToMany(Examen, {
  through: 'StudentExamens',
  foreignKey: 'idStudent',   
  otherKey: 'idExamen',      
  as: 'examens',
  onDelete: 'CASCADE'
});

Examen.belongsTo(Salle, { foreignKey: "idSalle", onDelete: "CASCADE" });
Salle.hasMany(Examen, { foreignKey: "idSalle" });

Examen.belongsTo(Categorie, { foreignKey: "idCategorie", onDelete: "CASCADE" });
Categorie.hasMany(Examen, { foreignKey: "idCategorie" });

module.exports = Examen;