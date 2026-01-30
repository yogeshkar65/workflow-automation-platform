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
  Skeleton,
  Alert,
  Backdrop,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===== LOAD WORKFLOW ===== */
  const loadWorkflow = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/workflows/${workflowId}`);
      setWorkflow(res.data);
    } catch {
      setError("Failed to load workflow");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflow();
    api.get("/users").then(res => setUsers(res.data || []));
  }, [workflowId]);

  /* ===== TASK ACTIONS ===== */
  const advanceStatus = async (task) => {
    try {
      setActionLoading(true);
      const idx = STATUS_ORDER.indexOf(task.status);
      const next = STATUS_ORDER[idx + 1];

      if (!next) {
        setActionLoading(false);
        return;
      }

      await api.put(`/tasks/${task._id}/status`, { status: next });
      await loadWorkflow();
      toast.success("Task status updated");
    } catch {
      toast.error("Failed to update task status");
    } finally {
      setActionLoading(false);
    }
  };

  const assignUser = async (taskId, userId) => {
    try {
      setActionLoading(true);
      await api.put(`/tasks/${taskId}/assign`, { userId: userId || null });
      await loadWorkflow();
      toast.success("Task assigned successfully");
    } catch {
      toast.error("Failed to assign user");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setActionLoading(true);
      toast.info("Deleting task...");
      await api.delete(`/tasks/${taskId}`);
      await loadWorkflow();
      toast.success("Task deleted successfully");
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteWorkflow = async () => {
    try {
      setActionLoading(true);
      toast.info("Deleting workflow...");
      await api.delete(`/workflows/${workflowId}`);
      toast.success("Workflow deleted successfully");
      navigate("/admin/workflows");
    } catch {
      toast.error("Failed to delete workflow");
    } finally {
      setActionLoading(false);
    }
  };

  /* ===== LOADING STATE ===== */
  if (loading) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
        <Skeleton width={140} height={40} />
        <Skeleton width="60%" height={24} sx={{ my: 2 }} />
        <Box display="flex" gap={4} mt={4}>
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton width="40%" height={30} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const progress = getProgress(workflow.tasks);
  const progressColor = getProgressColor(progress);

  return (
    <>
      {/* GLOBAL ACTION LOADER */}
      <Backdrop open={actionLoading} sx={{ zIndex: 2000 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
        <IconButton onClick={() => navigate("/admin/workflows")}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4" fontWeight={800} mb={1}>
          {workflow.title}
        </Typography>

        <Box textAlign="right" mb={2}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            disabled={actionLoading}
            onClick={deleteWorkflow}
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
          disabled={actionLoading}
          onClick={() =>
            navigate(`/admin/workflows/${workflowId}/createTask`)
          }
        >
          + Add Task
        </Button>

        <Divider sx={{ my: 3 }} />

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
                "&:hover": { background: "#fafafa" },
              }}
            >
              <Typography sx={{ flex: 2 }} fontWeight={600}>
                {index + 1}. {task.title}
              </Typography>

              <Select
                size="small"
                sx={{ flex: 2 }}
                value={task.assignedTo?._id || ""}
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
                disabled={actionLoading}
                onClick={() => deleteTask(task._id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          );
        })}
      </Box>
    </>
  );
}
