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
   await queryInterface.bulkInsert('ValidationStatuses', [
    {
      name: "Brouillon",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "En attente de modération",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Validé",
      createdAt: new Date(),
      updatedAt: new Date(),
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
