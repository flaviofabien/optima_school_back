const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Salle = require("./salle.model");
const Student = require("./student.model");

const PartitionSalle = sequelize.define("PartitionSalle", {
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
});

PartitionSalle.belongsToMany(Student, {
  through: 'StudentPartitionSalles',
  foreignKey: 'idPartitionSalle',    
  otherKey: 'idStudent',      
  as: 'students',
  onDelete: 'CASCADE'
});

Student.belongsToMany(PartitionSalle, {
  through: 'StudentPartitionSalles',
  foreignKey: 'idStudent',   
  otherKey: 'idPartitionSalle',      
  as: 'partitionSalles',
  onDelete: 'CASCADE'
});

PartitionSalle.belongsTo(Salle, { foreignKey: "idSalle", onDelete: "CASCADE" });
Salle.hasMany(PartitionSalle, { foreignKey: "idSalle" });

module.exports = PartitionSalle;