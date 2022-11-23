'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ParkingParticuliers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      zipCode: {
        type: Sequelize.STRING,
        allowNull: false ,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
        },
      lattitude: {
        type: Sequelize.STRING,
        allowNull: false
      },
      longitude: {
        type: Sequelize.STRING,
        allowNull: false
        },
      picture: {
        type: Sequelize.STRING,
        allowNull: false
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isActivated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ParkingParticuliers');
  }
};