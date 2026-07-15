const settingService = require("../services/settingService");

const getAll = async (req, res, next) => {
  try {
    const settings = await settingService.getAll();
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

const getByKey = async (req, res, next) => {
  try {
    const setting = await settingService.getByKey(req.params.key);
    res.status(200).json({ success: true, data: setting });
  } catch (err) {
    next(err);
  }
};

const upsert = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    const setting = await settingService.upsert(key, value);
    res.status(200).json({ success: true, data: setting });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await settingService.remove(req.params.key);
    res.status(200).json({ success: true, message: "Setting deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getByKey, upsert, remove };
