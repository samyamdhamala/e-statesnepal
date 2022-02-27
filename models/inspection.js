'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class inspection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  inspection.init({
    requestor_id: DataTypes.INTEGER,
    viewer_id: DataTypes.INTEGER,
    property_id: DataTypes.INTEGER,
    datetime: DataTypes.DATE,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'inspection',
  });
  return inspection;
};