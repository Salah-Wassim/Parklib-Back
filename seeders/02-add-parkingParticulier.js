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
                name: "Parking Test 01",
                address: "15 rue des Moutons",
                zipCode: "33000",
                city: "Bordeaux",
                lattitude: 0.0,
                longitude: 0.0,
                picture: "MaSuperImage",
                fk_user_id: 1,
                nbPlace: 1,
                assurance: true,
                type: "INTERIEUR",
                description: "Une description de base, ect...",
                price: 20.0,
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
    },
};
