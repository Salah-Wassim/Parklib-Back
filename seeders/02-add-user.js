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
        firstName:"John",
        lastName:"Doe",
        password:'123soleilFuck',
        phone:"0654852514",
        picture: "image1",
        address: "10 rue du chateau",
        email: "john.doe@yopmail.com",
        isActivated: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Cecile",
        lastName:"Ansieux",
        password:'*******',
        phone:"0635421598",
        picture: "maSuperImage",
        address: "56 rue la mottepiqué",
        email: "cecile.ansieux@yopmail.com",
        isActivated: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "Salah",
        lastName:"Arfa",
        password:'salah06.',
        phone:"0642724434",
        picture: "image",
        address: "36 rue de la cité des Pins",
        email: "salahwassim.arfae1@gmal.com",
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
