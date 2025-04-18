const { signup, signin } = require("../services/admin.service");

const router = require("express").Router();

router.post("/signup", async (req, res) => {
  return await signup(req, res);
});

router.post("/signin", async (req, res) => {
  return await signin(req, res);
});

module.exports = router;
