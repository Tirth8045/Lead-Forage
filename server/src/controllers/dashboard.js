const dashboardService = require("../services/dashboardService");

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
