const { Router } = require("express");
const router = Router();

const settingController = require("../controllers/setting");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.use(isAuthenticated);

router.get("/", settingController.getAll);
router.get("/:key", settingController.getByKey);
router.post("/", isAdmin, settingController.upsert);
router.put("/:key", isAdmin, settingController.upsert);
router.delete("/:key", isAdmin, settingController.remove);

module.exports = router;
