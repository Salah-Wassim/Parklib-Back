'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      OwnerId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'Users',
          key: 'id'
        }
      },
      TenantId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'Users',
          key: 'id'
        }
      },
      PostId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references:{
          model:'Posts',
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};