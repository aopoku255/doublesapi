"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.EventRegistration, { foreignKey: "userId" });
      User.hasMany(models.Otp, {
        foreignKey: "userId",
        as: "otps",
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      gender: DataTypes.STRING,
      image: DataTypes.STRING,
      age: DataTypes.INTEGER,
      occupation: DataTypes.STRING,
      nameOfSpouse: DataTypes.STRING,
      ageOfSpouse: DataTypes.INTEGER,
      phoneNumberOfSpouse: DataTypes.STRING,
      marriageDuration: DataTypes.STRING,
      firstTimeUser: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
