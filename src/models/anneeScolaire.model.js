const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Ecole = require("./ecole.model");

const AnneeScolaire = sequelize.define("AnneeScolaire",{
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
            len: [3, 50],
          }
    }
    ,dateDebut : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le nom ne doit pas être vide" },
            len: [3, 50],
          }
    },dateFin : {
        type : DataTypes.STRING,
        allowNull : false,
        validate: {
            notEmpty: { msg: "Le nom ne doit pas être vide" },
            len: [3, 50],
          }
    },
    idEcole : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references: {
            model: Ecole, 
            key: "id",
        },
        onDelete: "CASCADE",
        unique : {
            msg : "cette nom existe deja , Réessayer  une autre "
        }
    },
},{
    timestamps : true,
    createdAt : false,
    updatedAt : false
})                                                                                                                                               

AnneeScolaire.belongsTo(Ecole, { foreignKey: "idEcole", onDelete: "CASCADE" });
Ecole.hasMany(AnneeScolaire, { foreignKey: "idEcole" });

module.exports = AnneeScolaire;