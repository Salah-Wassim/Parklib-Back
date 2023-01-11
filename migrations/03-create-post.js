'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title:{
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      picture: {
        type: Sequelize.STRING,
        allowNull: true
      },
      typeOfPlace:{
        type: Sequelize.STRING,
        allowNull: false
      },
      adress:{
        type: Sequelize.STRING,
        allowNull: false
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      isAssured: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      ParkingParticulierId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'ParkingParticuliers',
          key:'id'
        }
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
    await queryInterface.dropTable('Posts');
  }
};