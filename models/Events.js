const { default: mongoose } = require("mongoose");

const EventsSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Admin",
    },

    eventTitle: {
      type: String,
      required: true,
    },
    eventCategory: {
      type: String,
      required: true,
      enum: [
        "Conference",
        "Workshop",
        "Seminar",
        "Webinar",
        "Networking",
        "Social Event",
        "Charity",
        "Exhibition",
        "Concert",
        "Festival",
        "Summit",
      ],
    },
    eventDescription: {
      type: String,
      required: true,
    },
    eventLocation: {
      type: String,
      required: true,
    },
    eventStartDate: {
      type: Date,
      required: true,
    },
    eventEndDate: {
      type: Date,
      required: true,
    },
    eventStartTime: {
      type: String,
      default: "00:00",
    },
    eventImages: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Events", EventsSchema);
