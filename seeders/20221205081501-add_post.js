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
        picture : '',
        typeOfPlace: 'souterrain',
        adress: '10 rue du chateaux',
        contact : 'email',
        status: '',
        isAssured: true,
        parkingParticulier_id:2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title : "Parking2",
        description : "Grand parking",
        price : 4500,
        picture : '',
        typeOfPlace: 'exterieur',
        adress: '1 rue de la motte',
        contact : 'email',
        status: '',
        isAssured: true,
        parkingParticulier_id:1,
        createdAt: new Date(),
        updatedAt: new Date()
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
