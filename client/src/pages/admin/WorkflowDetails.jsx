import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Select,
  MenuItem,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

/* ===== STATUS FLOW ===== */
const STATUS_ORDER = ["pending", "in-progress", "completed"];

/* ===== STATUS COLORS ===== */
const STATUS_COLORS = {
  pending: { bg: "#fdecea", color: "#d32f2f" },
  "in-progress": { bg: "#fff8e1", color: "#f9a825" },
  completed: { bg: "#e8f5e9", color: "#2e7d32" },
};

/* ===== PROGRESS ===== */
const getProgress = (tasks = []) => {
  if (!tasks.length) return 0;
  const done = tasks.filter(t => t.status === "completed").length;
  return Math.round((done / tasks.length) * 100);
};

const getProgressColor = (v) => {
  if (v <= 20) return "#e36565";
  if (v <= 40) return "#ddeb16";
  if (v <= 60) return "#7865da";
  if (v <= 90) return "#81c784";
  return "#2e7d32";
};

export default function WorkflowDetails() {
  const { workflowId } = useParams();
  const navigate = useNavigate();

  const [workflow, setWorkflow] = useState(null);
  const [users, setUsers] = useState([]);

  const loadWorkflow = async () => {
    const res = await api.get(`/workflows/${workflowId}`);
    setWorkflow(res.data);
  };

  useEffect(() => {
    loadWorkflow();
    api.get("/users").then(res => setUsers(res.data || []));
  }, [workflowId]);

  if (!workflow) return null;

  /* ===== TASK ACTIONS ===== */
  const advanceStatus = async (task) => {
    const idx = STATUS_ORDER.indexOf(task.status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    await api.put(`/tasks/${task._id}/status`, { status: next });
    loadWorkflow();
  };

  const assignUser = async (taskId, userId) => {
    await api.put(`/tasks/${taskId}/assign`, { userId: userId || null });
    loadWorkflow();
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${taskId}`);
    loadWorkflow();
  };

  /* ===== WORKFLOW DELETE ===== */
  const deleteWorkflow = async () => {
    if (!window.confirm("Delete this workflow? This cannot be undone.")) return;
    await api.delete(`/workflows/${workflowId}`);
    navigate("/admin/workflows");
  };

  const progress = getProgress(workflow.tasks);
  const progressColor = getProgressColor(progress);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      {/* BACK */}
      <IconButton onClick={() => navigate("/admin/workflows")}>
        <ArrowBackIcon />
      </IconButton>

      {/* HEADER + WORKFLOW DELETE */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="h4" fontWeight={800}>
          {workflow.title}
        </Typography>

        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={deleteWorkflow}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Delete Workflow
        </Button>
      </Box>

      <Typography color="text.secondary" mb={3}>
        {workflow.description}
      </Typography>

      {/* PROGRESS */}
      <Box display="flex" alignItems="center" gap={4} mb={4}>
        <Box sx={{ position: "relative", width: 120, height: 120 }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={120}
            sx={{ color: "#e0e0e0", position: "absolute" }}
          />
          <CircularProgress
            variant="determinate"
            value={progress}
            size={120}
            sx={{ color: progressColor, position: "absolute" }}
          />
          <Typography
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
            }}
          >
            {progress}%
          </Typography>
        </Box>

        <Typography fontWeight={700}>
          {workflow.tasks.filter(t => t.status === "completed").length} /{" "}
          {workflow.tasks.length} tasks completed
        </Typography>
      </Box>

      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() =>
          navigate(`/admin/workflows/${workflowId}/createTask`)
        }
      >
        + Add Task
      </Button>

      <Divider sx={{ mb: 3 }} />

      {/* TASK LIST */}
      {workflow.tasks.map((task, index) => {
        const c = STATUS_COLORS[task.status];

        return (
          <Box
            key={task._id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
            }}
          >
            <Typography fontWeight={600} sx={{ flex: 2 }}>
              {index + 1}. {task.title}
            </Typography>

            <Select
              size="small"
              sx={{ flex: 2 }}
              value={task.assignedTo?._id || ""}
              displayEmpty
              onChange={(e) =>
                assignUser(task._id, e.target.value || null)
              }
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {users.map(u => (
                <MenuItem key={u._id} value={u._id}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>

            <Chip
              label={task.status.replace("-", " ")}
              clickable
              onClick={() => advanceStatus(task)}
              sx={{
                bgcolor: c.bg,
                color: c.color,
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            />

            <IconButton
              color="error"
              onClick={() => deleteTask(task._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })}
    </Box>
  );
}