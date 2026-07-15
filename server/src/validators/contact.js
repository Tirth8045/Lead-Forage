const AppError = require("../utils/AppError");

const validateCreate = (req, res, next) => {
  const { firstName, lastName } = req.body;
  const errors = [];

  if (!firstName || typeof firstName !== "string" || firstName.trim().length < 1) {
    errors.push("First name is required");
  }
  if (!lastName || typeof lastName !== "string" || lastName.trim().length < 1) {
    errors.push("Last name is required");
  }

  if (errors.length > 0) {
    return next(new AppError(errors.join("; "), 400));
  }

  req.body.firstName = firstName.trim();
  req.body.lastName = lastName.trim();
  if (req.body.email) req.body.email = req.body.email.toLowerCase().trim();
  next();
};

const validateUpdate = (req, res, next) => {
  if (req.body.firstName) req.body.firstName = req.body.firstName.trim();
  if (req.body.lastName) req.body.lastName = req.body.lastName.trim();
  if (req.body.email) req.body.email = req.body.email.toLowerCase().trim();
  next();
};

module.exports = { validateCreate, validateUpdate };
