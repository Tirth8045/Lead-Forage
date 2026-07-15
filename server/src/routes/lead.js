const { Router } = require("express");
const router = Router();

const leadController = require("../controllers/lead");
const { validateCreate, validateUpdate } = require("../validators/lead");
const { isAuthenticated, isManager } = require("../middleware/auth");

router.use(isAuthenticated);

router.get("/", leadController.getAll);
router.get("/:id", leadController.getById);
router.post("/", validateCreate, leadController.create);
router.put("/:id", validateUpdate, leadController.update);
router.patch("/:id/assign", isManager, leadController.assign);
router.post("/:id/convert", leadController.convert);
router.delete("/:id", isManager, leadController.remove);

module.exports = router;
