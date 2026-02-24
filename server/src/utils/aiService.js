const axios = require("axios");
const Workflow = require("../models/workflow");
const Task = require("../models/task");

const generateResponse = async (user, message) => {

  let context = "";

  // ================= ADMIN =================
  if (user.role === "admin") {

    const workflows = await Workflow.find();
    const tasks = await Task.find().sort({ workflow: 1, order: 1 });

    let blockedCount = 0;
    let stalledWorkflows = [];

    const workflowMap = {};

    // Group tasks by workflow
    tasks.forEach(task => {
      const wfId = task.workflow.toString();
      if (!workflowMap[wfId]) workflowMap[wfId] = [];
      workflowMap[wfId].push(task);
    });

    // Detect blocked / stalled workflows
    Object.entries(workflowMap).forEach(([wfId, taskList]) => {
      for (let i = 1; i < taskList.length; i++) {
        const prev = taskList[i - 1];
        const curr = taskList[i];

        if (prev.status !== "completed" && curr.status === "pending") {
          blockedCount++;

          const wf = workflows.find(w => w._id.toString() === wfId);
          if (wf) {
            stalledWorkflows.push(
              `${wf.title} blocked at step ${curr.order}`
            );
          }

          break;
        }
      }
    });

    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const pendingTasks = tasks.filter(t => t.status === "pending").length;
    const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;

    context = `
You are an AI system health analyst for a workflow automation platform.

System Data:
Total Workflows: ${workflows.length}
Total Tasks: ${tasks.length}
Completed Tasks: ${completedTasks}
Pending Tasks: ${pendingTasks}
In Progress Tasks: ${inProgressTasks}
Blocked Tasks: ${blockedCount}

Stalled Workflows:
${stalledWorkflows.length ? stalledWorkflows.join("\n") : "None"}

Admin Question:
${message}

Provide actionable insights, identify bottlenecks, and suggest improvements.
`;
  }

  // ================= USER =================
  else {

    const userTasks = await Task.find({ assignedTo: user._id })
      .populate("workflow", "title")
      .sort({ workflow: 1, order: 1 });

    let blockedCount = 0;

    for (let i = 1; i < userTasks.length; i++) {
      const prev = userTasks[i - 1];
      const curr = userTasks[i];

      if (
        prev.workflow?._id?.toString() === curr.workflow?._id?.toString() &&
        prev.status !== "completed" &&
        curr.status === "pending"
      ) {
        blockedCount++;
      }
    }

    const completed = userTasks.filter(t => t.status === "completed").length;
    const pending = userTasks.filter(t => t.status === "pending").length;
    const inProgress = userTasks.filter(t => t.status === "in-progress").length;

    // Detailed task list for Gemini intelligence
    const taskDetails = userTasks.map(t => {
      return `${t.workflow?.title || "Workflow"} - Step ${t.order} - ${t.status}`;
    }).join("\n");

    context = `
You are an AI productivity assistant helping a user manage workflow tasks.

User Task Overview:
${taskDetails}

Summary:
Total Assigned Tasks: ${userTasks.length}
Completed: ${completed}
Pending: ${pending}
In Progress: ${inProgress}
Blocked Tasks: ${blockedCount}

User Question:
${message}

Suggest the next best task.
Explain clearly if something is blocked.
Provide practical advice.
`;
  }

  // ================= GEMINI CALL =================
  try {

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: context }]
          }
        ]
      }
    );

    return response.data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Gemini REST Error:", error.response?.data || error.message);
    return "AI service is temporarily unavailable.";
  }
};

module.exports = { generateResponse };