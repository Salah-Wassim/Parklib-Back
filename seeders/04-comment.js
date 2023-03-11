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
    await queryInterface.bulkInsert('Comments', [
      {
        title:"Super",
        content:'Bonne experience avec cette utilisateur, je recommande',
        UserId: 1,
        AuthorId:2,
        ValidationStatusId:2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title:"Rien à dire",
        content:'Je recommande',
        UserId: 1,
        AuthorId:2,
        ValidationStatusId:1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title:"Déçus",
        content:'Personne qui ne respecte pas ses engagments',
        UserId: 2,
        AuthorId:1,
        ValidationStatusId:1,
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
