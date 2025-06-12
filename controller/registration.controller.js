const { userRegistration } = require("../services/registration.service");

const router = require("express").Router();

router.post("/registration", async (req, res) => {
  return await userRegistration(req, res);
});

module.exports = router;
