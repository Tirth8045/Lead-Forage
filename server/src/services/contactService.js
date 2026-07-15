const Contact = require("../models/Contact");
const AppError = require("../utils/AppError");

const getAll = async (query, user) => {
  const { assignedTo, search, page = 1, limit = 20 } = query;
  const filter = {};

  if (user && user.role === "sales") {
    filter.assignedTo = user._id;
  } else {
    if (assignedTo) filter.assignedTo = assignedTo;
  }
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter)
    .populate("assignedTo", "fullName email")
    .populate("lead", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return {
    contacts,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const getById = async (id) => {
  const contact = await Contact.findById(id)
    .populate("assignedTo", "fullName email")
    .populate("lead", "name");
  if (!contact) throw new AppError("Contact not found", 404);
  return contact;
};

const create = async (data, user) => {
  if (!data.assignedTo && user) data.assignedTo = user._id;
  const contact = await Contact.create(data);
  return contact;
};

const update = async (id, data, user) => {
  if (user && user.role === "sales") {
    const existing = await Contact.findById(id);
    if (!existing) throw new AppError("Contact not found", 404);
    if (existing.assignedTo && existing.assignedTo.toString() !== user._id.toString()) {
      throw new AppError("Not authorized to update this contact", 403);
    }
  }
  const contact = await Contact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("assignedTo", "fullName email")
    .populate("lead", "name");
  if (!contact) throw new AppError("Contact not found", 404);
  return contact;
};

const remove = async (id, user) => {
  if (user && user.role === "sales") {
    const existing = await Contact.findById(id);
    if (!existing) throw new AppError("Contact not found", 404);
    if (existing.assignedTo && existing.assignedTo.toString() !== user._id.toString()) {
      throw new AppError("Not authorized to delete this contact", 403);
    }
  }
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) throw new AppError("Contact not found", 404);
  return contact;
};

module.exports = { getAll, getById, create, update, remove };
