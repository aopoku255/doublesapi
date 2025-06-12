const {
  signup,
  signin,
  getUserInfo,
  updateUserInfo,
  verifyOtp,
} = require("../services/auth.service");

const router = require("express").Router();

router.post("/signup", async (req, res) => {
  return await signup(req, res);
});

router.post("/signin", async (req, res) => {
  return await signin(req, res);
});

router.post("/verify-otp", async (req, res) => {
  return await verifyOtp(req, res);
});

router.get("/userinfo/:userId", async (req, res) => {
  return await getUserInfo(req, res);
});

router.patch("/userinfo/:userId", async (req, res) => {
  return await updateUserInfo(req, res);
});

module.exports = router;
