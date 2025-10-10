const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Salle = require("./salle.model");
const Student = require("./student.model");

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
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    unique : {
      msg : "cette nom existe deja , Réessayer  une autre "
    }
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

module.exports = Examen;