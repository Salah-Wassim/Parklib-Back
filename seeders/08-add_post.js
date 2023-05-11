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
      startDate:new Date(2023, 4, 22, 8 , 0 , 0), // the month is 0-indexed
      endDate:new Date(2023, 8, 22, 12 , 30 , 0), // the month is 0-indexed
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
