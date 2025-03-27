const mongoose = require("mongoose");

const EventRegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["registered", "cancelled", "attended"],
      default: "registered",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventRegistration", EventRegistrationSchema);
