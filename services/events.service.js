const Admin = require("../models/Admin");
const EventRegistration = require("../models/eventRegistration");
const Events = require("../models/Events");
const { uploadFile } = require("../upload");

const { responseMessages } = require("../utils/request-status");

async function createEvent(req, res) {
  console.log(req.file);
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
    const eventImage = await uploadFile(req.file, "events");

    // Create event
    // Check if the same event information already exists
    const existingEvent = await Events.findOne({
      eventStartDate: new Date(eventStartDate),
      eventEndDate: new Date(eventEndDate),
      eventName: req.body.eventName, // Assuming eventName is part of the request body
    });

    if (existingEvent) {
      return res.status(409).json({
        status: responseMessages["01"], // Assuming "03" corresponds to conflict
        message: "Event already exists",
      });
    }
    const event = await Events.create({
      ...req.body,
      userId: adminId, // Map adminId to userId
      eventStartDate: new Date(eventStartDate),
      eventEndDate: new Date(eventEndDate),
      eventImages: eventImage,
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

async function registerEvents(req, res) {
  const { userId, eventId } = req.body;

  const event = await Events.findById(eventId);

  if (!event) {
    return res.status(404).json({
      status: responseMessages["01"],
      message: "Event not found",
    });
  }

  // Check if the user is already registered for the event
  const existingRegistration = await EventRegistration.findOne({
    userId,
    eventId,
  });

  if (existingRegistration) {
    return res.status(409).json({
      status: responseMessages["01"],
      message: "User is already registered for this event",
    });
  }

  const eventRegistrations = await EventRegistration.create({
    userId,
    eventId,
  });

  return res.status(201).json({
    status: responseMessages["00"],
    message: "Event registered successfully",
    data: eventRegistrations,
  });
}

async function getEvents(req, res) {
  const events = await Events.find();

  return res.status(201).json({
    status: responseMessages["00"],
    data: events,
  });
}

async function getEventsById(req, res) {
  const { id } = req.params;

  const event = await Events.findById(id);

  if (!event) {
    return res.status(404).json({
      status: responseMessages["01"],
      message: "Event not found",
    });
  }

  return res.status(201).json({
    status: responseMessages["00"],
    data: event,
  });
}

module.exports = { createEvent, getEvents, getEventsById, registerEvents };
