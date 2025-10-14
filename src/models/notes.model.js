const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./student.model");
const Matiere = require("./matiere.model");
const Salle = require("./salle.model");

const Notes = sequelize.define("Notes", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  idStudent: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student, 
      key: "id",
    },
    onDelete: "CASCADE",
  },
    idMatiere: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Matiere, 
      key: "id",
    },
    onDelete: "CASCADE",
  },  idSalle: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Salle, 
      key: "id",
    },
    onDelete: "CASCADE",
  },
  note : {
    type: DataTypes.JSON,
    allowNull: false,
  }
});

Notes.belongsTo(Student, { foreignKey: "idStudent", onDelete: "CASCADE" });
Student.hasMany(Notes, { foreignKey: "idStudent" });

Notes.belongsTo(Matiere, { foreignKey: "idMatiere", onDelete: "CASCADE" });
Matiere.hasMany(Notes, { foreignKey: "idMatiere" });

Notes.belongsTo(Salle, { foreignKey: "idSalle", onDelete: "CASCADE" });
Salle.hasMany(Notes, { foreignKey: "idSalle" });

module.exports = Notes;