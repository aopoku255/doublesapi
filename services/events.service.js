const models = require("../models");
const { uploadFile } = require("../upload");
const QRCode = require("qrcode");

const { responseMessages } = require("../utils/request-status");
const sendMail = require("../helpers/sendMail");
const { default: axios } = require("axios");
const { sendSms } = require("../helpers/sendSMS");

async function createEvent(req, res) {
  console.log(req.file);
  try {
    const { eventStartDate, eventEndDate, adminId, eventTitle } = req.body;

    // Check if admin exists
    const adminExist = await models.Admin.findByPk(adminId);
    if (!adminExist) {
      return res.status(401).json({
        status: responseMessages["01"],
        message: "Admin does not exist",
      });
    }

    // Upload image
    const eventImage = await uploadFile(req.file, "events");

    // Check for duplicate event
    const existingEvent = await models.Event.findOne({
      where: {
        eventStartDate: new Date(eventStartDate),
        eventEndDate: new Date(eventEndDate),
        eventTitle,
      },
    });

    if (existingEvent) {
      return res.status(409).json({
        status: responseMessages["01"],
        message: "Event already exists",
      });
    }

    // Create event
    const event = await models.Event.create({
      ...req.body,
      adminId,
      eventStartDate: new Date(eventStartDate),
      eventEndDate: new Date(eventEndDate),
      eventImages: eventImage,
    });

    if (event) {
      // Fetch all users
      const users = await models.User.findAll({
        attributes: ["phone", "email"],
        where: {
          [models.Sequelize.Op.or]: [
            { phone: { [models.Sequelize.Op.ne]: null } },
            { email: { [models.Sequelize.Op.ne]: null } },
          ],
        },
      });

      // Extract phone numbers and emails
      const phoneNumbers = users
        .filter((user) => user.phone)
        .map((user) => user.phone)
        .join(",");

      const emailPromises = users
        .filter((user) => user.email)
        .map((user) =>
          sendMail(
            user.email,
            `<p>An event titled "<strong>${eventTitle}</strong>" has been created. Check it out!</p>`
          )
        );

      // Send all emails in parallel
      await Promise.all(emailPromises);

      // Send bulk SMS
      if (phoneNumbers) {
        await sendSms(
          phoneNumbers,
          `An event titled "${eventTitle}" has been created. Visit our platform for more info.`
        );
      }

      return res.status(201).json({
        status: responseMessages["00"],
        message: "Event created successfully and notifications sent",
        data: event,
      });
    }
  } catch (error) {
    console.error("createEvent error:", error);
    return res.status(500).json({
      status: responseMessages["02"],
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function registerEvents(req, res) {
  try {
    const { userId, eventId, attendingWithSpouse } = req.body;

    // Check if event exists
    const event = await models.Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({
        status: responseMessages["01"],
        message: "Event not found",
      });
    }

    // Check if user already registered for this event
    const existingRegistration = await models.EventRegistration.findOne({
      where: { userId, eventId },
    });

    if (existingRegistration) {
      return res.status(409).json({
        status: responseMessages["01"],
        message: "User is already registered for this event",
      });
    }

    // Generate QR code data URL
    const qrcodeData = await QRCode.toDataURL(userId.toString());

    // Upload QR code image
    const qrcodeUrl = await uploadFile(
      {
        buffer: Buffer.from(qrcodeData.split(",")[1], "base64"),
        mimetype: "image/png",
        originalname: `${userId}-qrcode.png`,
      },
      "qrcodes"
    );

    // Create event registration record
    const eventRegistration = await models.EventRegistration.create({
      userId,
      eventId,
      qrcode: qrcodeUrl,
      attendingWithSpouse: attendingWithSpouse,
    });

    return res.status(201).json({
      status: responseMessages["00"],
      message: "Event registered successfully",
      data: eventRegistration,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      status: responseMessages["01"],
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function getRegistrants(req, res) {
  try {
    const { userId, eventId } = req.query;

    // Basic validation
    if (!userId || !eventId) {
      return res.status(400).json({
        status: responseMessages["01"],
        message: "Missing required query parameters: userId and eventId",
      });
    }

    // Check if user exists
    const userExist = await models.User.findByPk(userId);
    if (!userExist) {
      return res.status(404).json({
        status: responseMessages["01"],
        message: "User not found",
      });
    }

    // Fetch event registrations
    const eventRegistrations = await models.EventRegistration.findAll({
      where: { userId, eventId },
      attributes: { exclude: ["code", "registrationDate"] },
    });

    if (!eventRegistrations || eventRegistrations.length === 0) {
      return res.status(200).json({
        status: responseMessages["01"],
        message: "No registrations found",
      });
    }

    return res.status(200).json({
      status: responseMessages["00"],
      message: "Registrations retrieved successfully",
      data: eventRegistrations,
    });
  } catch (error) {
    console.error("Error fetching registrants:", error); // helpful for logs
    return res.status(500).json({
      status: responseMessages["02"],
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function getUpcomingEvents(req, res) {
  try {
    // Get the current date and set the time to 00:00:00 (beginning of the day)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, milliseconds to 0

    // Get the current precise time (including hours, minutes, seconds)
    const currentPreciseTime = new Date();

    const events = await models.Event.findAll({
      where: {
        // Condition 1: Event must start on or after the beginning of today
        eventStartDate: {
          [models.Sequelize.Op.gte]: startOfToday,
        },
        // Condition 2: Event must end on or after the current precise time
        // This filters out events that started today but have already finished.
        eventEndDate: {
          [models.Sequelize.Op.gte]: currentPreciseTime,
        },
      },
      order: [["eventStartDate", "DESC"]], // Order by start date ascending
    });

    return res.status(200).json({
      status: responseMessages["00"],
      data: events,
    });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return res.status(500).json({
      status: responseMessages["01"],
      message: "Failed to fetch upcoming events",
    });
  }
}

async function getPastEvents(req, res) {
  try {
    const currentDate = new Date(); // This accurately captures current date and time

    const events = await models.Event.findAll({
      where: {
        eventEndDate: {
          [models.Sequelize.Op.lte]: currentDate, // Changed from Op.lt to Op.lte
        },
      },
      order: [["eventEndDate", "DESC"]], // Order by end date descending for most recent past events first
    });

    return res.status(200).json({
      status: responseMessages["00"],
      data: events,
    });
  } catch (error) {
    console.error("Error fetching past events:", error);
    return res.status(500).json({
      status: responseMessages["01"],
      message: "Failed to fetch past events",
    });
  }
}

async function getEventsById(req, res) {
  const { id } = req.params;

  try {
    const event = await models.Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        status: responseMessages["01"],
        message: "Event not found",
      });
    }

    return res.status(200).json({
      status: responseMessages["00"],
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    return res.status(500).json({
      status: responseMessages["02"],
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function getAllRegistrations(req, res) {
  try {
    const { eventId } = req.params;

    const registrations = await models.EventRegistration.findAll({
      where: { eventId }, // 🔍 Filter by the specific eventId
      include: [
        {
          model: models.User,
          as: "user", // Adjust if your alias is different
        },
      ],
    });

    if (!registrations || registrations.length === 0) {
      return res.status(404).json({
        status: responseMessages["01"],
        message: "No registrations found for this event",
      });
    }

    return res.status(200).json({
      status: responseMessages["00"],
      data: registrations,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return res.status(500).json({
      status: responseMessages["02"],
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = {
  createEvent,
  getUpcomingEvents,
  getEventsById,
  registerEvents,
  getRegistrants,
  getPastEvents,
  getAllRegistrations,
};
