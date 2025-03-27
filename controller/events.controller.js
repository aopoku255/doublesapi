const {
  createEvent,
  getEvents,
  getEventsById,
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

router.get("/get-events", async (req, res) => {
  return await getEvents(req, res);
});

router.get("/get-events/:id", async (req, res) => {
  return await getEventsById(req, res);
});

module.exports = router;
