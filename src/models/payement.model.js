const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Ecole = require("./ecole.model");
const Student = require("./student.model");

const Payement = sequelize.define("Payement", {
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
  idStudent: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Student, 
      key: "id",
    },
    onDelete: "CASCADE",
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  motif: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prix: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Payement.belongsTo(Ecole , { foreignKey: "idEcole", onDelete: "CASCADE" });
Ecole.hasMany(Payement, { foreignKey: "idEcole" });

Payement.belongsTo(Student , { foreignKey: "idStudent", onDelete: "CASCADE" });
Student.hasMany(Payement, { foreignKey: "idStudent" });

module.exports = Payement;