const FollowUp = require("../models/FollowUp");
const AppError = require("../utils/AppError");

const getAll = async (query, user) => {
  const { type, completed, assignedTo, relatedId, onModel, page = 1, limit = 20 } = query;
  const filter = {};

  if (user && user.role === "sales") {
    filter.assignedTo = user._id;
  } else {
    if (assignedTo) filter.assignedTo = assignedTo;
  }
  if (type) filter.type = type;
  if (completed !== undefined) filter.completed = completed === "true";
  if (relatedId) filter.relatedId = relatedId;
  if (onModel) filter.onModel = onModel;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await FollowUp.countDocuments(filter);
  const followUps = await FollowUp.find(filter)
    .populate("assignedTo", "fullName email")
    .sort({ dueDate: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  return {
    followUps,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const getById = async (id) => {
  const followUp = await FollowUp.findById(id).populate("assignedTo", "fullName email");
  if (!followUp) throw new AppError("Follow-up not found", 404);
  return followUp;
};

const create = async (data) => {
  const followUp = await FollowUp.create(data);
  return followUp;
};

const update = async (id, data, user) => {
  if (user && user.role === "sales") {
    const existing = await FollowUp.findById(id);
    if (!existing) throw new AppError("Follow-up not found", 404);
    if (existing.assignedTo.toString() !== user._id.toString()) {
      throw new AppError("Not authorized to update this follow-up", 403);
    }
  }
  const followUp = await FollowUp.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("assignedTo", "fullName email");
  if (!followUp) throw new AppError("Follow-up not found", 404);
  return followUp;
};

const remove = async (id, user) => {
  if (user && user.role === "sales") {
    const existing = await FollowUp.findById(id);
    if (!existing) throw new AppError("Follow-up not found", 404);
    if (existing.assignedTo.toString() !== user._id.toString()) {
      throw new AppError("Not authorized to delete this follow-up", 403);
    }
  }
  const followUp = await FollowUp.findByIdAndDelete(id);
  if (!followUp) throw new AppError("Follow-up not found", 404);
  return followUp;
};

const markComplete = async (id, user) => {
  if (user && user.role === "sales") {
    const existing = await FollowUp.findById(id);
    if (!existing) throw new AppError("Follow-up not found", 404);
    if (existing.assignedTo.toString() !== user._id.toString()) {
      throw new AppError("Not authorized to complete this follow-up", 403);
    }
  }
  const followUp = await FollowUp.findByIdAndUpdate(
    id,
    { completed: true },
    { new: true }
  ).populate("assignedTo", "fullName email");
  if (!followUp) throw new AppError("Follow-up not found", 404);
  return followUp;
};

module.exports = { getAll, getById, create, update, remove, markComplete };
