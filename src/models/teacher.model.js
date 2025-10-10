const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Matiere = require("./matiere.model");
const Classe = require("./classes.model");
const User = require("./user.model");

const Teacher = sequelize.define("Teacher",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true , 
        autoIncrement : true,
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
    }
    ,idMatiere: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Matiere, 
          key: "id",
        },
        onDelete: "CASCADE",
      }
      ,idClasse: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Classe, 
          key: "id",
        },
        onDelete: "CASCADE",
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
});

Teacher.belongsTo(User, { foreignKey: "idUser", onDelete: "CASCADE" });
User.hasOne(Teacher, { foreignKey: "idUser" });

Teacher.belongsTo(Matiere, { foreignKey: "idMatiere", onDelete: "CASCADE" });
Matiere.hasMany(Teacher, { foreignKey: "idMatiere" });

Teacher.belongsTo(Classe, { foreignKey: "idClasse", onDelete: "CASCADE" });
Classe.hasMany(Teacher, { foreignKey: "idClasse" });


module.exports = Teacher;