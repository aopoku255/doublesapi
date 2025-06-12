'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      adminId: {
        type: Sequelize.INTEGER
      },
      eventTitle: {
        type: Sequelize.STRING
      },
      eventHost: {
        type: Sequelize.STRING
      },
      eventDescription: {
        type: Sequelize.STRING
      },
      eventLocation: {
        type: Sequelize.STRING
      },
      eventStartDate: {
        type: Sequelize.DATE
      },
      eventEndDate: {
        type: Sequelize.DATE
      },
      eventStartTime: {
        type: Sequelize.STRING
      },
      eventEndTime: {
        type: Sequelize.STRING
      },
      eventImages: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Events');
  }
};