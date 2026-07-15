const { Router } = require("express");
const router = Router();

const noteController = require("../controllers/note");
const { isAuthenticated } = require("../middleware/auth");

router.use(isAuthenticated);

router.get("/", noteController.getAll);
router.post("/", noteController.create);
router.put("/:id", noteController.update);
router.delete("/:id", noteController.remove);

module.exports = router;
