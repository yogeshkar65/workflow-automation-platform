const Workflow = require("../models/workflow");
const Task = require("../models/task");
const { getWorkflowStatus } = require("../utils/workflowProgress");

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

    res.status(201).json(populatedWorkflow);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create workflow",
      error: error.message,
    });
  }
};
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

    const enrichedWorkflows = workflows.map(workflow => {
      const status = getWorkflowStatus(workflow.tasks);
      return {
        ...workflow.toObject(),
        status,
      };
    });

    res.status(200).json(enrichedWorkflows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch workflows",
      error: error.message,
    });
  }
};

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

    const status = getWorkflowStatus(workflow.tasks);

    res.status(200).json({
      ...workflow.toObject(),
      status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch workflow",
      error: error.message,
    });
  }
};

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

    res.status(200).json(populatedWorkflow);

  } catch (error) {
    res.status(500).json({
      message: "Failed to add task to workflow",
      error: error.message,
    });
  }
};

exports.deleteWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }


    await Task.deleteMany({ workflow: workflow._id });

    await workflow.deleteOne();

    res.status(200).json({ message: "Workflow deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete workflow",
      error: error.message,
    });
  }
};

