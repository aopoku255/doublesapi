"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventRegistration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventRegistration.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      EventRegistration.belongsTo(models.Event, {
        foreignKey: "eventId",
        as: "event",
      });
    }
  }
  EventRegistration.init(
    {
      userId: DataTypes.INTEGER,
      eventId: DataTypes.INTEGER,
      registrationDate: DataTypes.DATE,
      qrcode: DataTypes.STRING,
      code: DataTypes.STRING,
      attendingWithSpouse: DataTypes.BOOLEAN,
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
        defaultValue: "pending",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "EventRegistration",
    }
  );
  return EventRegistration;
};
