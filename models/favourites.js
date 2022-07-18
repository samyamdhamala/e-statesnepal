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
    Favourites.belongsTo(models.propertylist, {
      foreignKey: 'property_id',
      onDelete: 'CASCADE',
    });
    }
  };
  Favourites.init({
    id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    customer_id: DataTypes.INTEGER,
    property_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Favourites',
  });
  return Favourites;
};

