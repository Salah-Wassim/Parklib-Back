'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ParkingParticuliers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      zipCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
        },
      lattitude: {
        type: Sequelize.REAL,
        allowNull: true
      },
      longitude: {
        type: Sequelize.REAL,
        allowNull: true
        },
      picture: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nbPlace: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      assurance: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model: 'Users',
          key:'id'
        }
      },
      isActivated: {
        type: Sequelize.BOOLEAN,
        allowNull: false
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