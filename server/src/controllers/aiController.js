const axios = require("axios");
const Workflow = require("../models/workflow");
const Task = require("../models/task");

exports.generateWorkflowSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const workflow = await Workflow.findById(id);
    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const tasks = await Task.find({ workflow: id }).sort({ order: 1 });

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const pending = tasks.filter(t => t.status === "pending").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;

    const completionRate = total
      ? ((completed / total) * 100).toFixed(1)
      : 0;

    const taskBreakdown = tasks.map(t =>
      `Step ${t.order}: ${t.title} - ${t.status}`
    ).join("\n");

    const prompt = `
You are an enterprise workflow analyst.

Workflow Name: ${workflow.title}

Task Breakdown:
${taskBreakdown}

Summary Stats:
Total Tasks: ${total}
Completed: ${completed}
Pending: ${pending}
In Progress: ${inProgress}
Completion Rate: ${completionRate}%

Provide:
1. Overall workflow health
2. Identify bottlenecks
3. Actionable recommendations
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          { parts: [{ text: prompt }] }
        ]
      }
    );

    const summary =
      response.data.candidates[0].content.parts[0].text;

    res.json({ summary });

  } catch (error) {
    console.error("Workflow Summary Error:", error.response?.data || error.message);
    res.status(500).json({ message: "AI summary failed" });
  }
};

exports.generateWorkflowDescription = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Workflow title is required" });
    }

    const prompt = `
Generate a short, clear, professional workflow description 
for the following workflow title:

"${title}"

Keep it simple and concise.
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const description =
      response.data.candidates[0].content.parts[0].text;

    res.json({ description });

  } catch (error) {
    console.error("AI Description Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to generate description" });
  }
};

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: message }]
          }
        ]
      }
    );

    const reply =
      response.data.candidates[0].content.parts[0].text;

    res.json({ reply });

  } catch (error) {
    console.error("AI Chat Error:", error.response?.data || error.message);
    res.status(500).json({ message: "AI service error" });
  }
};