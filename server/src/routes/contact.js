const { Router } = require("express");
const router = Router();

const contactController = require("../controllers/contact");
const { validateCreate, validateUpdate } = require("../validators/contact");
const { isAuthenticated } = require("../middleware/auth");

router.use(isAuthenticated);

router.get("/", contactController.getAll);
router.get("/:id", contactController.getById);
router.post("/", validateCreate, contactController.create);
router.put("/:id", validateUpdate, contactController.update);
router.delete("/:id", contactController.remove);

module.exports = router;
