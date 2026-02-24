const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

const {
  generateWorkflowSummary,
  generateWorkflowDescription,
  chatWithAI
} = require("../controllers/aiController");

router.post("/workflow-summary/:id", protect, generateWorkflowSummary);
router.post("/generate-description", protect, generateWorkflowDescription);
router.post("/chat", protect, chatWithAI);

module.exports = router;