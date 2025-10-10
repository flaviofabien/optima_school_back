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
            len: {
                args : [3, 50],
                msg: "Le nom ne peut pas être inferieur à 3 (<3) ou superieur à 50 (>50)"   
            } 
          }
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { img: "L'img d'école ne doit pas être vide" },
        }
    },
    prenom : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le prenom ne doit pas être vide" },
            len: {
                args : [3, 50],
                msg: "Le prenom ne doit pas être vide"   
            }
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