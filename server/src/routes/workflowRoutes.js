const express = require("express");
const {createWorkflow, getWorkflowById, getWorkflows} = require("../controllers/workflowController");
const {adminOnly} = require("../middlewares/roleMiddleware");
const {protect} = require("../middlewares/authMiddleware");
const router  = express.Router();
router.post("/", protect, adminOnly, createWorkflow);
router.get("/", protect, getWorkflows);
router.get("/:id", protect, getWorkflowById);

module.exports = router;