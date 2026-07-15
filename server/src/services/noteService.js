const Note = require("../models/Note");
const AppError = require("../utils/AppError");

const getAll = async (query) => {
  const { relatedId, onModel, page = 1, limit = 50 } = query;
  const filter = {};

  if (relatedId) filter.relatedId = relatedId;
  if (onModel) filter.onModel = onModel;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Note.countDocuments(filter);
  const notes = await Note.find(filter)
    .populate("createdBy", "fullName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return {
    notes,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const create = async (data, userId) => {
  const note = await Note.create({ ...data, createdBy: userId });
  return note;
};

const update = async (id, data, userId) => {
  const note = await Note.findById(id);
  if (!note) throw new AppError("Note not found", 404);
  if (note.createdBy.toString() !== userId.toString()) {
    throw new AppError("Not authorized to edit this note", 403);
  }
  note.content = data.content || note.content;
  await note.save();
  return note;
};

const remove = async (id, userId) => {
  const note = await Note.findById(id);
  if (!note) throw new AppError("Note not found", 404);
  if (note.createdBy.toString() !== userId.toString()) {
    throw new AppError("Not authorized to delete this note", 403);
  }
  await Note.findByIdAndDelete(id);
  return note;
};

module.exports = { getAll, create, update, remove };
