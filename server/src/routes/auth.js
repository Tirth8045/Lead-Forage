const { Router } = require("express");
const router = Router();

const authController = require("../controllers/auth");
const { validateRegister, validateLogin } = require("../validators/auth");
const { isAuthenticated, isManager, isAdmin } = require("../middleware/auth");

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/logout", isAuthenticated, authController.logout);
router.get("/me", isAuthenticated, authController.getMe);
router.get("/users", isAuthenticated, isManager, authController.getAllUsers);
router.patch("/users/:id/role", isAuthenticated, isAdmin, authController.updateRole);

module.exports = router;
