"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Admin, { foreignKey: "adminId" });
      Event.hasMany(models.EventRegistration, { foreignKey: "eventId" });
    }
  }
  Event.init(
    {
      adminId: DataTypes.INTEGER,
      eventTitle: DataTypes.STRING,
      eventHost: DataTypes.STRING,
      eventDescription: DataTypes.STRING,
      eventLocation: DataTypes.STRING,
      eventStartDate: DataTypes.DATE,
      eventEndDate: DataTypes.DATE,
      eventStartTime: DataTypes.STRING,
      eventEndTime: DataTypes.STRING,
      eventImages: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
