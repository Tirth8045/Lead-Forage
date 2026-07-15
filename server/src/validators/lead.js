const AppError = require("../utils/AppError");

const validateCreate = (req, res, next) => {
  const { name } = req.body;
  if (!name || typeof name !== "string" || name.trim().length < 1) {
    return next(new AppError("Lead name is required", 400));
  }
  req.body.name = name.trim();
  if (req.body.email) req.body.email = req.body.email.toLowerCase().trim();
  next();
};

const validateUpdate = (req, res, next) => {
  if (req.body.email) req.body.email = req.body.email.toLowerCase().trim();
  if (req.body.name) req.body.name = req.body.name.trim();
  next();
};

module.exports = { validateCreate, validateUpdate };
