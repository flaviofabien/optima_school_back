const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Teacher = sequelize.define("Teacher",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true , 
        autoIncrement : true,
    },
    matricule : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le prenom ne doit pas être vide" },
            len: [3, 20],
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
    specialite: {
        type: DataTypes.STRING,
        allowNull : false, 
        validate: {
            notEmpty: { msg: "Le specialite ne doit pas être vide" },
        }
      },
    status: {
        type: DataTypes.STRING,
        defaultValue: "active", 
        allowNull : false, 
        validate: {
            notEmpty: { msg: "Le status ne doit pas être vide" },
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
            isEmail: { msg: "Format d'email invalide" },
        },
        unique : {
            msg : "cette email existe deja , Réessayer  une autre "
        }
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
            notEmpty: { msg: "Le img ne doit pas être vide" },
        }
    },
},{
    timestamps : true,
    createdAt : false,
    updatedAt : false
});


module.exports = Teacher;