"use strict";

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
        await queryInterface.bulkInsert('ParkingParticuliers', [
            {
                address: "15 rue des Moutons",
                zipCode: "33000",
                city: "Bordeaux",
                lattitude: 0.0,
                longitude: 0.0,
                UserId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                address: "Rue Sainte-Catherine",
                zipCode: "33000",
                city: "Bordeaux",
                lattitude: 44.83669,
                longitude: -0.573653,
                UserId: 3,
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
    },
};
