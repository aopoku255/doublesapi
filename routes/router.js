const router = require("express").Router();

router.use("/auth", require("../controller/auth.controller"));
router.use("/admin", require("../controller/admin.controller"));
router.use("/event", require("../controller/events.controller"));

module.exports = router;
