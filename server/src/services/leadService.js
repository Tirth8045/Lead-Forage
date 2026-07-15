const Lead = require("../models/Lead");
const Contact = require("../models/Contact");
const pipelineService = require("./pipelineService");
const AppError = require("../utils/AppError");

const getAll = async (query, user) => {
  const { status, assignedTo, search, page = 1, limit = 20 } = query;
  const filter = {};

  if (user && user.role === "sales") {
    filter.assignedTo = user._id;
  } else {
    if (assignedTo) filter.assignedTo = assignedTo;
  }
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Lead.countDocuments(filter);
  const leads = await Lead.find(filter)
    .populate("assignedTo", "fullName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return {
    leads,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const getById = async (id) => {
  const lead = await Lead.findById(id).populate("assignedTo", "fullName email");
  if (!lead) throw new AppError("Lead not found", 404);
  return lead;
};

const create = async (data, user) => {
  if (!data.assignedTo && user) data.assignedTo = user._id;
  const lead = await Lead.create(data);
  return lead;
};

const update = async (id, data, user) => {
  if (user && user.role === "sales") {
    const existing = await Lead.findById(id);
    if (!existing) throw new AppError("Lead not found", 404);
    if (existing.assignedTo && existing.assignedTo.toString() !== user._id.toString()) {
      throw new AppError("Not authorized to update this lead", 403);
    }
    if (data.assignedTo) {
      delete data.assignedTo;
    }
  }
  const lead = await Lead.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("assignedTo", "fullName email");
  if (!lead) throw new AppError("Lead not found", 404);
  return lead;
};

const remove = async (id, user) => {
  if (user && user.role === "sales") {
    const existing = await Lead.findById(id);
    if (!existing) throw new AppError("Lead not found", 404);
    if (existing.assignedTo && existing.assignedTo.toString() !== user._id.toString()) {
      throw new AppError("Not authorized to delete this lead", 403);
    }
  }
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) throw new AppError("Lead not found", 404);
  return lead;
};

const assign = async (leadId, assignedTo) => {
  const lead = await Lead.findByIdAndUpdate(
    leadId,
    { assignedTo },
    { new: true, runValidators: true }
  ).populate("assignedTo", "fullName email");
  if (!lead) throw new AppError("Lead not found", 404);
  return lead;
};

const convert = async (id) => {
  const lead = await Lead.findById(id);
  if (!lead) throw new AppError("Lead not found", 404);
  if (lead.status === "converted") throw new AppError("Lead already converted", 400);

  const nameParts = lead.name.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  const contact = await Contact.create({
    firstName,
    lastName,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    assignedTo: lead.assignedTo,
    lead: lead._id,
    convertedFrom: lead._id,
  });

  try {
    const pipeline = await pipelineService.getOrCreate();
    const firstStage = pipeline.stages.sort((a, b) => a.order - b.order)[0];
    if (!firstStage) throw new AppError("No stages in pipeline", 500);

    pipeline.deals.push({
      title: lead.name,
      value: 0,
      stageId: firstStage._id,
      contact: contact._id,
      lead: lead._id,
      assignedTo: lead.assignedTo,
      order: 0,
    });
    await pipeline.save();
    const deal = pipeline.deals[pipeline.deals.length - 1];

    lead.status = "converted";
    lead.convertedAt = new Date();
    lead.convertedTo = contact._id;
    await lead.save();

    return { lead, contact, deal };
  } catch (err) {
    await Contact.findByIdAndDelete(contact._id);
    throw err;
  }
};

module.exports = { getAll, getById, create, update, remove, assign, convert };
