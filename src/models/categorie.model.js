const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const AnneeScolaire = require("./anneeScolaire.model");
const Niveaux = require("./niveau.model");

const Categorie = sequelize.define("Categorie",{
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
          },
        unique : {
            msg : "cette nom existe deja , Réessayer  une autre "
        }
    },
    dateDebut : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    dateFin : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    type : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    idAnneeScolaire : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references: {
            model: AnneeScolaire, 
            key: "id",
          },
          onDelete: "CASCADE",
    },
    idNiveau: {
        type : DataTypes.INTEGER,
        allowNull : false,
        references: {
            model: Niveaux, 
            key: "id",
          },
          onDelete: "CASCADE",
    },
},{
    timestamps : true,
    createdAt : false,
    updatedAt : false
})

Categorie.belongsTo( Niveaux , { foreignKey: "idNiveau", onDelete: "CASCADE" });
Niveaux.hasMany(Categorie, { foreignKey: "idNiveau" });

Categorie.belongsTo( AnneeScolaire , { foreignKey: "idAnneeScolaire", onDelete: "CASCADE" });
AnneeScolaire.hasMany(Categorie, { foreignKey: "idAnneeScolaire" });

module.exports = Categorie;