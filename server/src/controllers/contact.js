const contactService = require("../services/contactService");

const getAll = async (req, res, next) => {
  try {
    const result = await contactService.getAll(req.query, req.user);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const contact = await contactService.getById(req.params.id);
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const contact = await contactService.create(req.body, req.user);
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const contact = await contactService.update(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await contactService.remove(req.params.id, req.user);
    res.status(200).json({ success: true, message: "Contact deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
