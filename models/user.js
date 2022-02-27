'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Admin, {as: 'admin'});
      User.hasMany(models.Customer, {as: 'customer'})
    }
  };
  
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull:false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull:false
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull:false
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false
    },
    role: {
      type: DataTypes.ENUM,
      values:["admin","customer"],
      defaultValue:"customer",
      allowNull:true 
    },
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
        beforeCreate: (u) => {
            const salt = bcrypt.genSaltSync(8);
            u.password = bcrypt.hashSync(u.password, salt);
        },
    },
  });

  User.prototype.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
  };
  return User;
  
};

