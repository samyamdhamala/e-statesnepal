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
   await queryInterface.bulkInsert("Users",[
     {
       firstName:"Junil",
       lastName:"Maharjan",
       phoneNumber:"9841676756",
       role:"admin",
       email:"maharjan2@gmail.com",
       password:bcrypt.hashSync("junil123.",salt),
       createdAt:moment().format("YYYY-MM-DD hh:mm:ss"),
       updatedAt:moment().format("YYYY-MM-DD hh:mm:ss")
     }, 
   ]);

   await queryInterface.bulkInsert("Admins",[
    {
      id:12,
      position:"manager",
      status:true,
      createdAt:moment().format("YYYY-MM-DD hh:mm:ss"),
      updatedAt:moment().format("YYYY-MM-DD hh:mm:ss")
    }, 
  ]);
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
