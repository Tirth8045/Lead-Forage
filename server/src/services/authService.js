const User = require("../models/User");
const AppError = require("../utils/AppError");

const register = async ({ fullName, email, password, adminCode }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const role =
    adminCode && process.env.ADMIN_SIGNUP_CODE && adminCode === process.env.ADMIN_SIGNUP_CODE
      ? "admin"
      : "sales";

  const user = new User({ email, fullName, role, isActive: true });
  await User.register(user, password);

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
};

const login = async (req, email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  if (!user.isActive) {
    throw new AppError("Account is deactivated", 403);
  }

  return new Promise((resolve, reject) => {
    req.login(user, (err) => {
      if (err) {
        return reject(new AppError("Login failed", 500));
      }
      resolve({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
    });
  });
};

const logout = (req) => {
  return new Promise((resolve, reject) => {
    req.logout((err) => {
      if (err) {
        return reject(new AppError("Logout failed", 500));
      }
      req.session.destroy((err) => {
        if (err) {
          return reject(new AppError("Session destruction failed", 500));
        }
        resolve();
      });
    });
  });
};

const getMe = (user) => {
  if (!user) {
    throw new AppError("Not authenticated", 401);
  }
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
};

const getAllUsers = async () => {
  const users = await User.find({}, "_id fullName email role isActive createdAt");
  return users;
};

const updateUserRole = async (userId, newRole) => {
  if (!["admin", "manager", "sales"].includes(newRole)) {
    throw new AppError("Invalid role. Must be admin, manager, or sales", 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true, select: "_id fullName email role isActive createdAt" }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

module.exports = { register, login, logout, getMe, getAllUsers, updateUserRole };
