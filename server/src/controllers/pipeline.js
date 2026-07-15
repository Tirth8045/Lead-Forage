const pipelineService = require("../services/pipelineService");

const getPipeline = async (req, res, next) => {
  try {
    const pipeline = await pipelineService.getOrCreate();
    if (req.query.assignedTo && req.user && req.user.role !== "sales") {
      await pipeline.populate("deals.assignedTo", "_id");
      pipeline.deals = pipeline.deals.filter(
        (d) => d.assignedTo && d.assignedTo._id.toString() === req.query.assignedTo
      );
    }
    res.status(200).json({ success: true, data: pipeline });
  } catch (err) {
    next(err);
  }
};

const getDealsByStage = async (req, res, next) => {
  try {
    const stages = await pipelineService.getDealsByStage(req.user, req.query.assignedTo);
    res.status(200).json({ success: true, data: stages });
  } catch (err) {
    next(err);
  }
};

const addStage = async (req, res, next) => {
  try {
    const pipeline = await pipelineService.addStage(req.body);
    res.status(201).json({ success: true, data: pipeline });
  } catch (err) {
    next(err);
  }
};

const updateStage = async (req, res, next) => {
  try {
    const pipeline = await pipelineService.updateStage(req.params.stageId, req.body);
    res.status(200).json({ success: true, data: pipeline });
  } catch (err) {
    next(err);
  }
};

const deleteStage = async (req, res, next) => {
  try {
    const pipeline = await pipelineService.deleteStage(req.params.stageId);
    res.status(200).json({ success: true, data: pipeline });
  } catch (err) {
    next(err);
  }
};

const addDeal = async (req, res, next) => {
  try {
    const pipeline = await pipelineService.addDeal(req.body, req.user);
    res.status(201).json({ success: true, data: pipeline });
  } catch (err) {
    next(err);
  }
};

const updateDeal = async (req, res, next) => {
  try {
    const deal = await pipelineService.updateDeal(req.params.dealId, req.body, req.user);
    res.status(200).json({ success: true, data: deal });
  } catch (err) {
    next(err);
  }
};

const deleteDeal = async (req, res, next) => {
  try {
    const pipeline = await pipelineService.deleteDeal(req.params.dealId, req.user);
    res.status(200).json({ success: true, data: pipeline });
  } catch (err) {
    next(err);
  }
};

const assignDeal = async (req, res, next) => {
  try {
    const deal = await pipelineService.assignDeal(req.params.dealId, req.body.assignedTo);
    res.status(200).json({ success: true, data: deal });
  } catch (err) {
    next(err);
  }
};

const moveDeal = async (req, res, next) => {
  try {
    const { targetStageId, order } = req.body;
    const pipeline = await pipelineService.moveDeal(req.params.dealId, targetStageId, order, req.user);
    res.status(200).json({ success: true, data: pipeline });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPipeline,
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
