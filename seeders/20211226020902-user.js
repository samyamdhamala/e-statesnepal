'use strict';
const bcrypt=require("bcrypt");
const moment = require("moment");

const salt=bcrypt.genSaltSync(8);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   return queryInterface.bulkInsert("Users",[
     {
       firstName:"Samyam",
       lastName:"Dhamala",
       phoneNumber:"9841676756",
       email:"samyamdhamala11@gmail.com",
       password:bcrypt.hashSync("samyam",salt),
       role:"buyer",
       createdAt:moment().format("YYYY-MM-DD hh:mm:ss"),
       updatedAt:moment().format("YYYY-MM-DD hh:mm:ss")

     },
     {
      firstName:"Bishesh",
      lastName:"Dangol",
      phoneNumber:"9841676753",
      email:"bisheshdangol@gmail.com",
      password:bcrypt.hashSync("bishesh",salt),
      role:"seller",
      createdAt:moment().format("YYYY-MM-DD hh:mm:ss"),
      updatedAt:moment().format("YYYY-MM-DD hh:mm:ss")

    }
   ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
