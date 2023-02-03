'use strict';

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
   await queryInterface.bulkInsert('Posts', [
    {
      title : "mon Super Parking",
      description : "Super parking",
      price : 30,
      typeOfPlace: 'souterrain',
      adress: '10 rue du chateaux',
      contact : 'email',
      status: '',
      isAssured: true,
      ParkingParticulierId:1,
      ValidationStatusId:3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
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
