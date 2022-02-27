'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('inspections', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      requestor_id: {
        type: Sequelize.INTEGER,
        references:{
          model:"Customers",
          key:"id"
      }
      },
      viewer_id: {
        type: Sequelize.INTEGER,
        references:{
          model:"Customers",
          key:"id"
      }
      },
      property_id: {
        type: Sequelize.INTEGER,
        references:{
          model:"propertylists",
          key:"id"
      }
      },
      datetime: {
        type: Sequelize.DATE
      },
      message: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('inspections');
  }
};