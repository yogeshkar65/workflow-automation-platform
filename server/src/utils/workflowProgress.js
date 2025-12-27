exports.getWorkflowStatus = (tasks = []) => {
  if (!tasks.length) return "not-started";

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;

  if (completed === 0) return "not-started";
  if (completed === total) return "completed";
  return "in-progress";
};
