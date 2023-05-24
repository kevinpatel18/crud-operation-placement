// represents the  model
const { Model, DataTypes } = require("sequelize");
const sequelize = require("./model/dbconfig");

class Placement extends Model {}

Placement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    date: {
      type: DataTypes.STRING,
    },
    workCarried: {
      type: DataTypes.STRING,
    },
    knowledge: {
      type: DataTypes.STRING,
    },
    Competency: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "placement",
    timestamps: false,
  }
);

module.exports = Placement;
