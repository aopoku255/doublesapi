"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      age: {
        type: Sequelize.INTEGER,
      },
      occupation: {
        type: Sequelize.STRING,
      },
      nameOfSpouse: {
        type: Sequelize.STRING,
      },
      ageOfSpouse: {
        type: Sequelize.INTEGER,
      },
      phoneNumberOfSpouse: {
        type: Sequelize.STRING,
      },
      marriageDuration: {
        type: Sequelize.STRING,
      },
      firstTimeUser: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
