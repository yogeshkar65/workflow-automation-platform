const express = require("express");

const { createTask,getTasks } = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, createTask);
router.get("/", protect, getTasks);

module.exports = router;
