const AppError = require("../utils/AppError");

const validateRegister = (req, res, next) => {
  const { fullName, email, password } = req.body;
  const errors = [];

  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
    errors.push("Full name is required and must be at least 2 characters");
  }

  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("A valid email is required");
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Password is required and must be at least 6 characters");
  }

  if (errors.length > 0) {
    return next(new AppError(errors.join("; "), 400));
  }

  req.body.email = email.toLowerCase().trim();
  req.body.fullName = fullName.trim();

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push("Email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return next(new AppError(errors.join("; "), 400));
  }

  req.body.email = email.toLowerCase().trim();

  next();
};

module.exports = { validateRegister, validateLogin };
