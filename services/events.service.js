const Admin = require("../models/Admin");
const Events = require("../models/Events");
const { uploadFile } = require("../upload");
const { responseMessages } = require("../utils/request-status");

async function createEvent(req, res) {
  try {
    const { eventStartDate, eventEndDate, adminId } = req.body;

    // Check if admin exists
    const adminExist = await Admin.findById(adminId);
    if (!adminExist) {
      return res.status(401).json({
        status: responseMessages["01"],
        message: "Admin does not exist",
      });
    }

    // Upload images
    const imageUploadPromises = req.files.map((file) =>
      uploadFile(file, "events")
    );
    const images = await Promise.all(imageUploadPromises);

    // Create event
    const event = await Events.create({
      ...req.body,
      userId: adminId, // Map adminId to userId
      eventStartDate: new Date(eventStartDate),
      eventEndDate: new Date(eventEndDate),
      eventImages: images,
    });

    if (event) {
      return res.status(201).json({
        status: responseMessages["00"],
        message: "Event created successfully",
        data: event,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: responseMessages["02"],
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function getEvents(req, res) {
  const events = await Events.find();

  return res.status(201).json({
    status: responseMessages["00"],
    data: events,
  });
}

module.exports = { createEvent, getEvents };
