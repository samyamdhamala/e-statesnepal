'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Customer.init({
    id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
    },
    state:{
      type:DataTypes.ENUM,
      values: [
        "Province No.1",
        "Province No.2",
        "Bagmati Pradesh",
        "Gandaki Pradesh",
        "Province No. 5",
        "Karnali Pradesh",
        "Sudurpaschim Pradesh",
      ],
    },
    dob: DataTypes.DATE,
    occupation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};