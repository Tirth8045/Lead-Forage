const leadService = require("../services/leadService");

const getAll = async (req, res, next) => {
  try {
    const result = await leadService.getAll(req.query, req.user);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const lead = await leadService.getById(req.params.id);
    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const lead = await leadService.create(req.body, req.user);
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const lead = await leadService.update(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await leadService.remove(req.params.id, req.user);
    res.status(200).json({ success: true, message: "Lead deleted" });
  } catch (err) {
    next(err);
  }
};

const assign = async (req, res, next) => {
  try {
    const lead = await leadService.assign(req.params.id, req.body.assignedTo);
    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

const convert = async (req, res, next) => {
  try {
    const result = await leadService.convert(req.params.id);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove, assign, convert };
