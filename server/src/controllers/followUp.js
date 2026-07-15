const followUpService = require("../services/followUpService");

const getAll = async (req, res, next) => {
  try {
    const result = await followUpService.getAll(req.query, req.user);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const followUp = await followUpService.getById(req.params.id);
    res.status(200).json({ success: true, data: followUp });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const followUp = await followUpService.create({ ...req.body, assignedTo: req.user._id });
    res.status(201).json({ success: true, data: followUp });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const followUp = await followUpService.update(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: followUp });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await followUpService.remove(req.params.id, req.user);
    res.status(200).json({ success: true, message: "Follow-up deleted" });
  } catch (err) {
    next(err);
  }
};

const markComplete = async (req, res, next) => {
  try {
    const followUp = await followUpService.markComplete(req.params.id, req.user);
    res.status(200).json({ success: true, data: followUp });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove, markComplete };
