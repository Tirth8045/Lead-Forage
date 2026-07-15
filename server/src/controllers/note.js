const noteService = require("../services/noteService");

const getAll = async (req, res, next) => {
  try {
    const result = await noteService.getAll(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const note = await noteService.create(req.body, req.user._id);
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const note = await noteService.update(req.params.id, req.body, req.user._id);
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await noteService.remove(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create, update, remove };
