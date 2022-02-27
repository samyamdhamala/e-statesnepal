'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favourites extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Favourites.init({
    customer_id: DataTypes.INTEGER,
    property_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Favourites',
  });
  return Favourites;
};

