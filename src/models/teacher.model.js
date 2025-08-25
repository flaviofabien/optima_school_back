const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");

const Teacher = sequelize.define("Teacher",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true , 
        autoIncrement : true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
        unique: true, 
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
},{
    timestamps : true,
    createdAt : false,
    updatedAt : false
});

User.hasOne(Teacher, { foreignKey: "userId", onDelete: "CASCADE" });
Teacher.belongsTo(User, { foreignKey: "userId" });

module.exports = Teacher;