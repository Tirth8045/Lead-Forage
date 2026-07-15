const { Router } = require("express");
const router = Router();

const pipelineController = require("../controllers/pipeline");
const { isAuthenticated, isManager } = require("../middleware/auth");

router.use(isAuthenticated);

router.get("/", pipelineController.getPipeline);
router.get("/deals", pipelineController.getDealsByStage);
router.post("/stages", isManager, pipelineController.addStage);
router.put("/stages/:stageId", isManager, pipelineController.updateStage);
router.delete("/stages/:stageId", isManager, pipelineController.deleteStage);
router.post("/deals", pipelineController.addDeal);
router.put("/deals/:dealId", pipelineController.updateDeal);
router.put("/deals/:dealId/move", pipelineController.moveDeal);
router.patch("/deals/:dealId/assign", isManager, pipelineController.assignDeal);
router.delete("/deals/:dealId", pipelineController.deleteDeal);

module.exports = router;
