const authService = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(req, email, password);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = authService.getMe(req.user);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const user = await authService.updateUserRole(req.params.id, req.body.role);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, getMe, getAllUsers, updateRole };
