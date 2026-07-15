const { Router } = require("express");
const router = Router();

const followUpController = require("../controllers/followUp");
const { isAuthenticated } = require("../middleware/auth");

router.use(isAuthenticated);

router.get("/", followUpController.getAll);
router.get("/:id", followUpController.getById);
router.post("/", followUpController.create);
router.put("/:id", followUpController.update);
router.put("/:id/complete", followUpController.markComplete);
router.delete("/:id", followUpController.remove);

module.exports = router;
