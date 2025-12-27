// const express = require("express");
// const router = express.Router();

// const {
//   createWorkflow,
//   getWorkflowById,
//   getWorkflows
// } = require("../controllers/workflowController");

// const { protect } = require("../middlewares/authMiddleware");
// const { adminOnly } = require("../middlewares/roleMiddleware");

// router.post("/", protect, adminOnly, createWorkflow);
// router.get("/", protect, getWorkflows);
// router.get("/:id", protect, getWorkflowById);

// module.exports = router;
const express = require("express");
const {
  createWorkflow,
  getWorkflows,
  getWorkflowById,
  deleteWorkflow,
} = require("../controllers/workflowController");

const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, createWorkflow);
router.get("/", protect, getWorkflows);
router.get("/:id", protect, getWorkflowById);
router.delete("/:id", protect, adminOnly, deleteWorkflow);

module.exports = router;
