const AppError = require("../utils/AppError");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return next(new AppError("Authentication required", 401));
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return next(new AppError("Admin access required", 403));
};

const isManager = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "manager")) {
    return next();
  }
  return next(new AppError("Manager or Admin access required", 403));
};

module.exports = { isAuthenticated, isAdmin, isManager };
