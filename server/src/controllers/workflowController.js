const Workflow = require("../models/workflow");
const Task = require("../models/task");

/* ================= CREATE WORKFLOW ================= */
exports.createWorkflow = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Workflow title is required" });
    }

    const workflow = await Workflow.create({
      title,
      description,
      createdBy: req.user._id,
      tasks: [],
    });

    const populatedWorkflow = await Workflow.findById(workflow._id)
      .populate("createdBy", "name email");

    // 🔥 Emit socket event
    const io = req.app.get("io");
    io.emit("taskUpdated");

    res.status(201).json(populatedWorkflow);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create workflow",
      error: error.message,
    });
  }
};

/* ================= GET ALL WORKFLOWS ================= */
exports.getWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find()
      .populate({
        path: "tasks",
        populate: {
          path: "assignedTo",
          select: "name email",
        },
      })
      .populate("createdBy", "name email");

    res.status(200).json(workflows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch workflows",
      error: error.message,
    });
  }
};

/* ================= GET WORKFLOW BY ID ================= */
exports.getWorkflowById = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id)
      .populate({
        path: "tasks",
        populate: {
          path: "assignedTo",
          select: "name email",
        },
      })
      .populate("createdBy", "name email");

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    if (req.user.role !== "admin") {
      const isAssigned = workflow.tasks.some(
        task =>
          task.assignedTo &&
          task.assignedTo._id.toString() === req.user._id.toString()
      );

      if (!isAssigned) {
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    res.status(200).json(workflow);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch workflow",
      error: error.message,
    });
  }
};

/* ================= ADD TASK TO WORKFLOW ================= */
exports.addTaskToWorkflow = async (req, res) => {
  try {
    const { workflowId, taskId } = req.body;

    if (!workflowId || !taskId) {
      return res.status(400).json({
        message: "workflowId and taskId are required",
      });
    }

    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (workflow.tasks.includes(taskId)) {
      return res.status(400).json({
        message: "Task already added to workflow",
      });
    }

    task.workflow = workflowId;
    await task.save();

    workflow.tasks.push(taskId);
    await workflow.save();

    const populatedWorkflow = await Workflow.findById(workflowId)
      .populate({
        path: "tasks",
        populate: {
          path: "assignedTo",
          select: "name email",
        },
      })
      .populate("createdBy", "name email");

    // 🔥 Emit socket event
    const io = req.app.get("io");
    io.emit("taskUpdated");

    res.status(200).json(populatedWorkflow);

  } catch (error) {
    res.status(500).json({
      message: "Failed to add task to workflow",
      error: error.message,
    });
  }
};

/* ================= DELETE WORKFLOW ================= */
exports.deleteWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    // 1️⃣ Delete all tasks of this workflow
    await Task.deleteMany({ workflow: workflow._id });

    // 2️⃣ Delete workflow
    await workflow.deleteOne();

    // 3️⃣ Emit SAME global event used everywhere
    const io = req.app.get("io");
    io.emit("taskUpdated"); // 🔥 change this

    res.status(200).json({ message: "Workflow deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete workflow",
      error: error.message,
    });
  }
};