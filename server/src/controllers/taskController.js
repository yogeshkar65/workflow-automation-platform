const Task = require("../models/task");
const Workflow = require("../models/workflow");
const User = require("../models/user");

/* ================= CREATE TASK ================= */
exports.createTask = async (req, res) => {
  try {
    const { title, workflow, assignedTo } = req.body;

    if (!title || !workflow) {
      return res.status(400).json({
        message: "Title and workflow are required"
      });
    }

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

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    // 🔔 SEND NOTIFICATION IF ASSIGNED DURING CREATION
    if (assignedTo) {
      const assignedUserId = String(assignedTo);

      console.log("CREATE TASK Assigned userId:", assignedUserId);
      console.log("OnlineUsers Map Keys:", [...onlineUsers.keys()]);

      if (onlineUsers.has(assignedUserId)) {
        const socketId = onlineUsers.get(assignedUserId);

        io.to(socketId).emit("newTaskAssigned", {
          message: `You have been assigned a new task: ${task.title}`,
        });

        console.log("✅ Notification sent during creation");
      } else {
        console.log("⚠️ Assigned user not online during creation");
      }
    }

    // 🔄 Refresh workflow for everyone
    io.emit("taskUpdated", workflow.toString());

    res.status(201).json(task);

  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
/* ================= GET TASKS ================= */
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

    const safeTasks = tasks.filter((t) => t.workflow);

    res.json(safeTasks);
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({ message: "Failed to load tasks" });
  }
};
/* ================= ASSIGN TASK STATUS ================= */
exports.assignTask = async (req, res) => {

  try {
    const { userId } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    let assignedUserId = null;

    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      assignedUserId = String(user._id); // force string
    }

    task.assignedTo = assignedUserId || null;
    await task.save();

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    console.log("Assigned userId:", assignedUserId);
    console.log("OnlineUsers Map:", onlineUsers);
    console.log("Map Keys:", [...onlineUsers.keys()]);
    console.log(
      "Has user?",
      assignedUserId ? onlineUsers.has(String(assignedUserId)) : false
    );

    // GUARANTEED STRING MATCH
    if (assignedUserId && onlineUsers.has(String(assignedUserId))) {
      const socketId = onlineUsers.get(String(assignedUserId));

      console.log("Emitting to socket:", socketId);

      io.to(socketId).emit("newTaskAssigned", {
        message: `You have been assigned a new task: ${task.title}`,
      });

      console.log("✅ Notification sent to:", assignedUserId);
    } else {
      console.log("⚠️ User not online or not found in Map");
    }

    io.emit("taskUpdated", String(task.workflow));

    res.json(task);

  } catch (err) {
    console.error("ASSIGN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
/* ================= UPDATE STATUS ================= */
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.role !== "admin" &&
      (!task.assignedTo ||
        task.assignedTo.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const prevTask = await Task.findOne({
      workflow: task.workflow,
      order: task.order - 1,
    });

    if (prevTask && prevTask.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Previous task must be completed first" });
    }

    if (task.status === status) {
      return res.json(task);
    }

    task.status = status;
    await task.save();

    const io = req.app.get("io");

    // 🔄 Refresh workflow
    io.emit("taskUpdated", task.workflow.toString());

    res.json(task);
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE TASK ================= */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const workflowId = task.workflow;

    await Workflow.findByIdAndUpdate(workflowId, {
      $pull: { tasks: task._id },
    });

    await task.deleteOne();

    const io = req.app.get("io");

    // 🔄 Refresh workflow
    io.emit("taskUpdated", workflowId.toString());

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};