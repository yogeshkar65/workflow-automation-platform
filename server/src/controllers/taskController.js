 const Task = require("../models/task");
const Workflow = require("../models/workflow");
const User = require("../models/user");

/* =========================
   CREATE TASK (ADMIN)
========================= */
exports.createTask = async (req, res) => {
  try {
    const { title, workflow, assignedTo } = req.body;

    const lastTask = await Task.findOne({ workflow }).sort("-order");

    const task = await Task.create({
      title,
      workflow,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      status: "pending",
      order: lastTask ? lastTask.order + 1 : 1,
    });

    await Workflow.findByIdAndUpdate(workflow, {
      $push: { tasks: task._id },
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET TASKS
   ✅ ADMIN → ALL
   ✅ USER  → ASSIGNED ONLY
========================= */
exports.getTasks = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "user") {
      query = { assignedTo: req.user._id };
    }

    const tasks = await Task.find(query)
      .populate("workflow", "title")
      .populate("assignedTo", "name email")
      .sort({ workflow: 1, order: 1 });

    // 🔥 FILTER TASKS WITH BROKEN WORKFLOW
    const safeTasks = tasks.filter(t => t.workflow);

    res.json(safeTasks);
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({ message: "Failed to load tasks" });
  }
};

/* =========================
   ASSIGN TASK (ADMIN)
========================= */
exports.assignTask = async (req, res) => {
  try {
    const { userId } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (userId) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
    }

    task.assignedTo = userId || null;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE STATUS (SEQUENTIAL)
========================= */
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // AUTHORIZATION
    if (
      req.user.role !== "admin" &&
      (!task.assignedTo ||
        task.assignedTo.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // SEQUENTIAL ENFORCEMENT
    const prevTask = await Task.findOne({
      workflow: task.workflow,
      order: task.order - 1,
    });

    if (prevTask && prevTask.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Previous task must be completed first" });
    }

    // 🔥 SAFETY (PREVENT DUPLICATE UPDATE)
    if (task.status === status) {
      return res.json(task);
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   DELETE TASK (ADMIN)
========================= */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await Workflow.findByIdAndUpdate(task.workflow, {
      $pull: { tasks: task._id },
    });

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
