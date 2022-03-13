"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class propertylist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  propertylist.init(
    {
      
      customer_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      streetaddress: { type: DataTypes.STRING, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
      province: { type: DataTypes.STRING, allowNull: false },
      area: { type: DataTypes.STRING, allowNull: false },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      image: {type: DataTypes.STRING, allowNull: false},
      type: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false },
      latitude: { type: DataTypes.STRING, allowNull: false },
      longitude: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "propertylist",
    }
  );
  return propertylist;
};
