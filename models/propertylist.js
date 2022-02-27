'use strict';
const {
  Model
} = require('sequelize');
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
  };
  propertylist.init({
    customer_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    streetaddress: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    area: DataTypes.STRING,
    price:{
      type:DataTypes.FLOAT,
      allowNull:false
    },
    type: DataTypes.STRING,
    status: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'propertylist',
  });
  return propertylist;
};