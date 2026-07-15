const Lead = require("../models/Lead");
const Contact = require("../models/Contact");
const Pipeline = require("../models/Pipeline");
const FollowUp = require("../models/FollowUp");

const getStats = async () => {
  const [
    totalLeads,
    leadsByStatus,
    totalContacts,
    pipeline,
    pendingFollowUps,
    overdueFollowUps,
  ] = await Promise.all([
    Lead.countDocuments(),
    Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Contact.countDocuments(),
    Pipeline.findOne(),
    FollowUp.countDocuments({ completed: false, dueDate: { $gte: new Date() } }),
    FollowUp.countDocuments({ completed: false, dueDate: { $lt: new Date() } }),
  ]);

  const activeDeals = pipeline
    ? pipeline.deals.filter((d) => {
        const stage = pipeline.stages.id(d.stageId);
        return stage && stage.name !== "Closed Lost";
      })
    : [];

  const totalDealsValue = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0);

  const wonDeals = pipeline
    ? pipeline.deals.filter((d) => {
        const stage = pipeline.stages.id(d.stageId);
        return stage && stage.name === "Closed Won";
      })
    : [];

  const wonDealsValue = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0);

  return {
    totalLeads,
    leadsByStatus: leadsByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    totalContacts,
    totalDeals: pipeline ? pipeline.deals.length : 0,
    totalDealsValue,
    wonDeals: wonDeals.length,
    wonDealsValue,
    pendingFollowUps,
    overdueFollowUps,
  };
};

module.exports = { getStats };
