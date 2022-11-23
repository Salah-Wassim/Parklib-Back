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
                      title: 'Parking Test 01',
                      address: "15 rue des Moutons",
                      zipCode:"33000",
                      city: "Bordeaux",
                      lattitude: "0",
                      longitude: "0",
                      picture: "",
                      UserId: 1,
                      isActivated: true ,
                      createdAt: (new Date((new Date()) - 1000 * 60 * 60 * 24 * 1)) ,
                      updatedAt: new Date() 
                },
                {
                      title: 'Parking Test 02',
                      address: "23 rue des Biquettes",
                      zipCode:"33000",
                      city: "Pessac",
                      lattitude: "0",
                      longitude: "0",
                      picture: "",
                      UserId: 1,
                      isActivated: true ,
                      createdAt: (new Date((new Date()) - 1000 * 60 * 60 * 24 * 3)),
                      updatedAt: (new Date((new Date()) - 1000 * 60 * 60 * 24 * 2))
                },
                {
                    title: 'Parking Test 03',
                    address: "2 place du Palais",
                    zipCode:"33000",
                    city: "Bordeaux",
                    lattitude: "0",
                    longitude: "0",
                    picture: "",
                    UserId: 1,
                    isActivated: true ,
                    createdAt: (new Date((new Date()) - 1000 * 60 * 60 * 24 * 5)),
                    updatedAt: (new Date((new Date()) - 1000 * 60 * 60 * 24 * 2))
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