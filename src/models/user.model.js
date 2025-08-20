const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true , 
        autoIncrement : true,
    },
    nom : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le nom ne doit pas être vide" },
            len: [3, 20],
            isAlphanumeric: true,
          }
    },
    prenom : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le prenom ne doit pas être vide" },
            len: [3, 20],
            isAlphanumeric: true,
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
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true
      }
      
},{
    timestamps : true,
    createdAt : false,
    updatedAt : false
})

module.exports = User;