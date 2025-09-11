const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Classe = require("./classes.model");

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
    matricule : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le nom ne doit pas être vide" },
            len: [3, 50],
        }
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
    nom : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le nom ne doit pas être vide" },
            len: [3, 50],
          }
    },
    prenom : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le prenom ne doit pas être vide" },
            len: [3, 50],
          }
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le email ne doit pas être vide" },
        },
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le password ne doit pas être vide" },
        }
    },
    role : {
        type : DataTypes.STRING,
        allowNull : false, 
        validate: {
            notEmpty: { msg: "Le role ne doit pas être vide" },
        }
    },
    img : {
        type : DataTypes.STRING,
        allowNull : false, 
        validate: {
            notEmpty: { msg: "Le role ne doit pas être vide" },
        }
    },
},{
    timestamps : true,
    createdAt : false,
    updatedAt : false
})

Student.belongsTo(Classe, { foreignKey: "idClasse", onDelete: "CASCADE" });
Classe.hasMany(Student, { foreignKey: "idClasse" });


module.exports = Student;