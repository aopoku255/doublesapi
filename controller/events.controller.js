const {
  createEvent,
  getEventsById,
  registerEvents,
  getRegistrants,
  getUpcomingEvents,
  getPastEvents,
  getAllRegistrations,
} = require("../services/events.service");
const router = require("express").Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage: storage });

router.post(
  "/create-event",
  uploadMiddleware.single("image"),
  async (req, res) => {
    return await createEvent(req, res);
  }
);

router.get("/get-upcoming-events", async (req, res) => {
  return await getUpcomingEvents(req, res);
});

router.get("/get-past-events", async (req, res) => {
  return await getPastEvents(req, res);
});

router.post("/register-events", async (req, res) => {
  return await registerEvents(req, res);
});

router.get("/get-registrants", async (req, res) => {
  return await getRegistrants(req, res);
});

router.get("/get-events/:id", async (req, res) => {
  return await getEventsById(req, res);
});

router.get("/get-all-registrations/:eventId", async (req, res) => {
  return await getAllRegistrations(req, res);
});
module.exports = router;
