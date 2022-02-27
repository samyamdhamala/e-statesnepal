'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references:{
            model:"Users",
            key:"id"
        }
      },
      state: {
        type: Sequelize.ENUM,
        values: [
          "Province No.1",
          "Province No.2",
          "Bagmati Pradesh",
          "Gandaki Pradesh",
          "Province No. 5",
          "Karnali Pradesh",
          "Sudurpaschim Pradesh",
        ],
        allowNull:false
      },
      dob: {
        type: Sequelize.DATE,
        allowNull:false
      },
      occupation: {
        type: Sequelize.STRING,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Customers');
  }
};