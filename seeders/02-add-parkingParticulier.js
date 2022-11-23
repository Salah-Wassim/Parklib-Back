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

        await queryInterface.bulkInsert(
            "ParkingParticuliers",
            [
                {
                    name: "Parking Test 01",
                    address: "15 rue des Moutons",
                    zipCode: "33000",
                    city: "Bordeaux",
                    lattitude: "0",
                    longitude: "0",
                    picture: "",
                    UserId: 1,
                    nbPlace: 1,
                    assurance: true,
                    type: "INTERIEUR",
                    description: "Une description de base, ect...",
                    price: 20.0,
                    isActivated: true,
                    createdAt: new Date(new Date() - 1000 * 60 * 60 * 24 * 1),
                    updatedAt: new Date(),
                },
                {
                    name: "Parking Test 02",
                    address: "23 rue des Biquettes",
                    zipCode: "33000",
                    city: "Pessac",
                    lattitude: "0",
                    longitude: "0",
                    picture: "",
                    UserId: 1,
                    nbPlace: 1,
                    assurance: true,
                    type: "INTERIEUR",
                    description: "Une description de base, ect...",
                    price: 25.0,
                    isActivated: true,
                    createdAt: new Date(new Date() - 1000 * 60 * 60 * 24 * 3),
                    updatedAt: new Date(new Date() - 1000 * 60 * 60 * 24 * 2),
                },
                {
                    name: "Parking Test 03",
                    address: "2 place du Palais",
                    zipCode: "33000",
                    city: "Bordeaux",
                    lattitude: "0",
                    longitude: "0",
                    picture: "",
                    UserId: 1,
                    nbPlace: 1,
                    assurance: true,
                    type: "EXTERIEUR",
                    description: "Une description de base, ect...",
                    price: 16.0,
                    isActivated: true,
                    createdAt: new Date(new Date() - 1000 * 60 * 60 * 24 * 5),
                    updatedAt: new Date(new Date() - 1000 * 60 * 60 * 24 * 2),
                },
            ],
            {}
        );
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
