const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./student.model");

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
  notes : {
    type: DataTypes.JSON,
    allowNull: false,
  }
});

Notes.belongsTo(Student, { foreignKey: "idStudent", onDelete: "CASCADE" });
Student.hasMany(Notes, { foreignKey: "idStudent" });

module.exports = Notes;