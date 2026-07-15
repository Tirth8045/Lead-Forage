const { Router } = require("express");
const router = Router();

const dashboardController = require("../controllers/dashboard");
const { isAuthenticated } = require("../middleware/auth");

router.use(isAuthenticated);

router.get("/stats", dashboardController.getStats);

module.exports = router;
