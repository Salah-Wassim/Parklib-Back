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
      contact : 'email',
      isAssured: true,
      UserId:1,
      ParkingParticulierId:1,
      ValidationStatusId:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title : "zertyuiop",
      description : "blabla",
      price : 100,
      typeOfPlace: 'souterrain',
      contact : 'email',
      isAssured: true,
      UserId:3,
      ParkingParticulierId:2,
      ValidationStatusId:2,
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
