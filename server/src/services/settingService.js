const Setting = require("../models/Setting");
const AppError = require("../utils/AppError");

const getAll = async () => {
  return await Setting.find().sort({ key: 1 });
};

const getByKey = async (key) => {
  const setting = await Setting.findOne({ key });
  if (!setting) throw new AppError(`Setting "${key}" not found`, 404);
  return setting;
};

const upsert = async (key, value) => {
  const setting = await Setting.findOneAndUpdate(
    { key },
    { value },
    { new: true, upsert: true, runValidators: true }
  );
  return setting;
};

const remove = async (key) => {
  const setting = await Setting.findOneAndDelete({ key });
  if (!setting) throw new AppError(`Setting "${key}" not found`, 404);
  return setting;
};

module.exports = { getAll, getByKey, upsert, remove };
