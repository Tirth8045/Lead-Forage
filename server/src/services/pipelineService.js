const Pipeline = require("../models/Pipeline");
const AppError = require("../utils/AppError");

const DEFAULT_STAGES = [
  { name: "Lead In", order: 0 },
  { name: "Contacted", order: 1 },
  { name: "Qualified", order: 2 },
  { name: "Proposal", order: 3 },
  { name: "Negotiation", order: 4 },
  { name: "Closed Won", order: 5 },
  { name: "Closed Lost", order: 6 },
];

const getOrCreate = async () => {
  let pipeline = await Pipeline.findOne();
  if (!pipeline) {
    pipeline = await Pipeline.create({ stages: DEFAULT_STAGES });
  }
  return pipeline;
};

const getDealsByStage = async (user, assignedTo) => {
  const pipeline = await getOrCreate();
  await pipeline.populate("deals.contact", "firstName lastName email company");
  await pipeline.populate("deals.lead", "name");
  await pipeline.populate("deals.assignedTo", "fullName email");
  if (user && user.role === "sales") {
    pipeline.deals = pipeline.deals.filter(
      (d) => d.assignedTo && d.assignedTo._id.toString() === user._id.toString()
    );
  } else if (assignedTo) {
    pipeline.deals = pipeline.deals.filter(
      (d) => d.assignedTo && d.assignedTo._id.toString() === assignedTo
    );
  }
  return pipeline.getDealsByStage();
};

const addStage = async (data) => {
  const pipeline = await getOrCreate();
  const maxOrder = pipeline.stages.reduce((max, s) => Math.max(max, s.order), -1);
  pipeline.stages.push({ name: data.name, order: maxOrder + 1 });
  await pipeline.save();
  return pipeline;
};

const updateStage = async (stageId, data) => {
  const pipeline = await getOrCreate();
  const stage = pipeline.stages.id(stageId);
  if (!stage) throw new AppError("Stage not found", 404);
  if (data.name) stage.name = data.name;
  if (data.order !== undefined) stage.order = data.order;
  await pipeline.save();
  return pipeline;
};

const deleteStage = async (stageId) => {
  const pipeline = await getOrCreate();
  const stage = pipeline.stages.id(stageId);
  if (!stage) throw new AppError("Stage not found", 404);
  pipeline.stages.pull(stageId);
  pipeline.deals = pipeline.deals.filter((d) => d.stageId.toString() !== stageId);
  await pipeline.save();
  return pipeline;
};

const addDeal = async (data, user) => {
  const pipeline = await getOrCreate();
  const maxOrder = pipeline.deals
    .filter((d) => d.stageId.toString() === data.stageId)
    .reduce((max, d) => Math.max(max, d.order), -1);
  pipeline.deals.push({
    title: data.title,
    value: data.value || 0,
    stageId: data.stageId,
    contact: data.contact,
    lead: data.lead,
    assignedTo: data.assignedTo || (user ? user._id : undefined),
    order: maxOrder + 1,
  });
  await pipeline.save();
  return pipeline;
};

const updateDeal = async (dealId, data, user) => {
  const pipeline = await getOrCreate();
  const deal = pipeline.deals.id(dealId);
  if (!deal) throw new AppError("Deal not found", 404);
  if (user && user.role === "sales") {
    if (deal.assignedTo && deal.assignedTo.toString() !== user._id.toString()) {
      throw new AppError("Not authorized to update this deal", 403);
    }
    if (data.assignedTo) {
      delete data.assignedTo;
    }
  }
  if (data.title) deal.title = data.title;
  if (data.value !== undefined) deal.value = data.value;
  if (data.stageId) deal.stageId = data.stageId;
  if (data.contact) deal.contact = data.contact;
  if (data.lead) deal.lead = data.lead;
  if (data.assignedTo) deal.assignedTo = data.assignedTo;
  if (data.order !== undefined) deal.order = data.order;
  await pipeline.save();
  return deal;
};

const deleteDeal = async (dealId, user) => {
  const pipeline = await getOrCreate();
  const deal = pipeline.deals.id(dealId);
  if (!deal) throw new AppError("Deal not found", 404);
  if (user && user.role === "sales") {
    if (deal.assignedTo && deal.assignedTo.toString() !== user._id.toString()) {
      throw new AppError("Not authorized to delete this deal", 403);
    }
  }
  pipeline.deals.pull(dealId);
  await pipeline.save();
  return pipeline;
};

const assignDeal = async (dealId, assignedTo) => {
  const pipeline = await getOrCreate();
  const deal = pipeline.deals.id(dealId);
  if (!deal) throw new AppError("Deal not found", 404);
  deal.assignedTo = assignedTo;
  await pipeline.save();
  return deal;
};

const moveDeal = async (dealId, targetStageId, newOrder, user) => {
  const pipeline = await getOrCreate();
  const deal = pipeline.deals.id(dealId);
  if (!deal) throw new AppError("Deal not found", 404);
  if (user && user.role === "sales") {
    if (deal.assignedTo && deal.assignedTo.toString() !== user._id.toString()) {
      throw new AppError("Not authorized to move this deal", 403);
    }
  }
  const stageExists = pipeline.stages.some((s) => s._id.toString() === targetStageId);
  if (!stageExists) throw new AppError("Target stage not found", 404);

  deal.stageId = targetStageId;
  if (newOrder !== undefined) {
    deal.order = newOrder;
  } else {
    const maxOrder = pipeline.deals
      .filter((d) => d.stageId.toString() === targetStageId)
      .reduce((max, d) => Math.max(max, d.order), -1);
    deal.order = maxOrder + 1;
  }
  await pipeline.save();
  return pipeline;
};

module.exports = {
  getOrCreate,
  getDealsByStage,
  addStage,
  updateStage,
  deleteStage,
  addDeal,
  updateDeal,
  deleteDeal,
  assignDeal,
  moveDeal,
};
