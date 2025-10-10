const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Classe = require("./classes.model");
const Niveaux = require("./niveau.model");
const Salle = require("./salle.model");
const User = require("./user.model");


const Student = sequelize.define("Student",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true , 
        autoIncrement : true,
    },
    idClasse: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Classe, 
          key: "id",
        },
        onDelete: "CASCADE",
    },
    idNiveau: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Niveaux, 
          key: "id",
        },
        onDelete: "CASCADE",
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
    dateNaissance : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le prenom ne doit pas être vide" },
            len: [3, 50],
          }
    },
    sex : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le prenom ne doit pas être vide" },
            len: [3, 20],
          }
    },
    address : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le address ne doit pas être vide" },
        }
    },
    phone : {
        type : DataTypes.STRING,
        allowNull : false, 
        validate: {
            notEmpty: { msg: "Le phone ne doit pas être vide" },
        }
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "active", 
        allowNull : false, 
        validate: {
            notEmpty: { msg: "Le phone ne doit pas être vide" },
        }
    },
    idUser : {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: User, 
          key: "id",
        },
        onDelete: "CASCADE",
    }
},{
    timestamps : true,
    createdAt : false,
    updatedAt : false
})
Student.belongsTo(User, { foreignKey: "idUser", onDelete: "CASCADE" });
User.hasOne(Student, { foreignKey: "idUser" });

Student.belongsTo(Classe, { foreignKey: "idClasse", onDelete: "CASCADE" });
Classe.hasMany(Student, { foreignKey: "idClasse" });

Student.belongsTo(Niveaux, { foreignKey: "idNiveau", onDelete: "CASCADE" });
Niveaux.hasMany(Student, { foreignKey: "idNiveau" });

Student.belongsTo(Salle, { foreignKey: "idSalle", onDelete: "CASCADE" });
Salle.hasMany(Student, { foreignKey: "idSalle" });

module.exports = Student;