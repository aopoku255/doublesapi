const { signup, signin, getAdmins } = require("../services/admin.service");

const router = require("express").Router();

router.post("/signup", async (req, res) => {
  return await signup(req, res);
});

router.post("/signin", async (req, res) => {
  return await signin(req, res);
});

router.get("/get-admins", async (req, res) => {
  return await getAdmins(req, res);
});

module.exports = router;
