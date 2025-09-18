const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");

const Ecole = sequelize.define("Ecole", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User, 
          key: "id",
        },
        onDelete: "CASCADE",
      },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Le nom de l'école ne doit pas être vide" },
            len: {
                args : [3, 100],
                msg: "Le nom ne peut pas être inferieur à 3 (<3) ou superieur à 100 (>100)"   
            } 
        }
    },
    adresse: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "L'adresse ne doit pas être vide" },
            len: {
                args : [3, 50],
                msg: "L'adresse ne peut pas être inferieur à 3 (<3) ou superieur à 50 (>50)"   
            } 
        }
    },
    type: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { img: "L'img d'école ne doit pas être vide" },
        }
    }
}, {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
});

module.exports = Ecole;