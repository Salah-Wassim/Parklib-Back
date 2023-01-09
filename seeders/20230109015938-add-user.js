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
    await queryInterface.bulkInsert('Users', [
      {
        firstname: "John",
        lastname:"Doe",
        password:'ndionddz',
        phone:"0654852514",
        picture: "image1",
        address: "10 rue du chateau",
        email: "john.doe@yopmail.com",
        isActivated: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Cecile",
        lastname:"Ansieux",
        password:'nfezofezifz',
        phone:"0635421598",
        picture: "maSuperImage",
        address: "56 rue la mottepiqué",
        email: "cecile.ansieux@yopmail.com",
        isActivated: true,
        createdAt: new Date(),
        updatedAt: new Date(),
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
