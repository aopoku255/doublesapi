const { createEvent, getEvents } = require("../services/events.service");

const router = require("express").Router();

router.post("/create-event", async (req, res) => {
  return await createEvent(req, res);
});

router.get("/get-events", async (req, res) => {
  return await getEvents(req, res);
});

module.exports = router;
