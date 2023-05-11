'use strict';

const bcrypt = require('bcrypt');
const constant = require('../utils/constantes.util.js');

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

    const password = await bcrypt.hash('password', constant.SALT_HASH_KEY);
    await queryInterface.bulkInsert('Users', [
      {
        firstName:"super",
        lastName:"admin",
        password,
        phone:"00 00 00 00 00",
        picture: "image1",
        address: "10 rue du chateau",
        email: "super@admin.com",
        isActivated: true,
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
