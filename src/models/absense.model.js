const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Student = require("./student.model");

const Absence = sequelize.define("Absence", {
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
   motif : {
        type : DataTypes.STRING,
        allowNull : false,
    },
   dateDebut : {
        type : DataTypes.STRING,
        allowNull : false,

    },
   dateFin : {
        type : DataTypes.STRING,
        allowNull : false,

    },
    heurDebut : {
      type : DataTypes.STRING,
        allowNull : true,
    },
    heurFin : {
      type : DataTypes.STRING,
        allowNull : true
    }
});

Absence.belongsTo(Student, { foreignKey: "idStudent", onDelete: "CASCADE" });
Student.hasMany(Absence, { foreignKey: "idStudent"});

module.exports = Absence;