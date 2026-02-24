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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import  socket  from "../../services/socket";


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
  const done = tasks.filter((t) => t.status === "completed").length;
  return Math.round((done / tasks.length) * 100);
};

const getProgressColor = (value) => {
  if (value <= 20) return "#d32f2f";
  if (value <= 50) return "#fb8c00";
  if (value <= 70) return "#25b9f9ff";
  if (value <= 90) return "#77c67bff";
  return "#2e7d32";
};

export default function WorkflowDetails() {
  const { workflowId } = useParams();
  const navigate = useNavigate();

  const [workflow, setWorkflow] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionText, setActionText] = useState(null);

  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [confirmWorkflowDelete, setConfirmWorkflowDelete] = useState(false);

  const [aiSummary, setAiSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  /* ===== LOAD WORKFLOW ===== */
  const loadWorkflow = async () => {
    try {
      const res = await api.get(`/workflows/${workflowId}`);
      setWorkflow(res.data);
    } catch {
      toast.error("Failed to load workflow");
    }
  };

  /* ===== LOAD USERS ===== */
  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch {
      toast.error("Failed to load users");
    }
  };

  /* ===== INITIAL LOAD ===== */
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await Promise.all([loadWorkflow(), loadUsers()]);
      } finally {
        setLoading(false);
      }
    };

    if (workflowId) init();
  }, [workflowId]);

  /* ===== SOCKET LISTENER ===== */
  useEffect(() => {
    socket.on("taskUpdated", (updatedWorkflowId) => {
      if (updatedWorkflowId === workflowId) {
        loadWorkflow();
      }
    });

    return () => {
      socket.off("taskUpdated");
    };
  }, [workflowId]);

  /* ===== STATUS CHANGE ===== */
  const advanceStatus = async (task) => {
    try {
      setActionText("Updating status...");
      const idx = STATUS_ORDER.indexOf(task.status);
      const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];

      await api.put(`/tasks/${task._id}/status`, { status: next });

      

      await loadWorkflow();
      toast.success(`Moved to ${next.replace("-", " ")}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setActionText(null);
    }
  };

  /* ===== ASSIGN USER ===== */
  const assignUser = async (taskId, userId) => {
    try {
      setActionText("Updating task...");
      await api.put(`/tasks/${taskId}/assign`, { userId: userId || null })

      await loadWorkflow();
      toast.success("Task assigned");
    } catch {
      toast.error("Assignment failed");
    } finally {
      setActionText(null);
    }
  };

  /* ===== DELETE TASK ===== */
  const confirmDeleteTask = async () => {
    try {
      setActionText("Deleting task...");
      await api.delete(`/tasks/${deleteTaskId}`);

   

      await loadWorkflow();
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleteTaskId(null);
      setActionText(null);
    }
  };

  /* ===== DELETE WORKFLOW ===== */
  const confirmDeleteWorkflow = async () => {
    try {
      setActionText("Deleting workflow...");
      await api.delete(`/workflows/${workflowId}`);
      navigate("/admin/workflows");
    } catch {
      toast.error("Failed to delete workflow");
    } finally {
      setConfirmWorkflowDelete(false);
      setActionText(null);
    }
  };

      const handleGenerateSummary = async () => {
      try {
        setLoadingSummary(true);

        const res = await api.post(
          `/ai/workflow-summary/${workflowId}`
        );

        setAiSummary(res.data.summary);

      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSummary(false);
      }
    };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, py: 3 }}>
        <Skeleton width={200} height={40} />
        <Skeleton width="40%" height={24} sx={{ my: 2 }} />
        <Box display="flex" gap={4} mt={4}>
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton width="30%" height={30} />
        </Box>
      </Box>
    );
  }

  if (!workflow) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Alert severity="error">Workflow not found</Alert>
      </Box>
    );
  }

  const progress = getProgress(workflow.tasks);

  return (
    <>
    
      {/* ===== BACKDROP ===== */}
    <Backdrop open={!!actionText} sx={{ zIndex: 2000, background: "rgba(255,255,255,0.6)" }}>
      <Box textAlign="center">
        <CircularProgress sx={{ color: "#1976d2" }} />
        <Typography mt={2} fontWeight={700} color="#1976d2">
          {actionText}
        </Typography>
      </Box>
    </Backdrop>

    {/* ===== DELETE TASK DIALOG ===== */}
    <Dialog open={!!deleteTaskId} onClose={() => setDeleteTaskId(null)}>
      <DialogTitle>Delete Task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action cannot be undone. Are you sure?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteTaskId(null)}>Cancel</Button>
        <Button color="error" onClick={confirmDeleteTask}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>

    {/* ===== DELETE WORKFLOW DIALOG ===== */}
    <Dialog
      open={confirmWorkflowDelete}
      onClose={() => setConfirmWorkflowDelete(false)}
    >
      <DialogTitle>Delete Workflow</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deleting a workflow will remove all tasks permanently.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmWorkflowDelete(false)}>
          Cancel
        </Button>
        <Button color="error" onClick={confirmDeleteWorkflow}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
      

      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 }, py: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={() => navigate("/admin/workflows")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight={800}>
              {workflow.title}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setConfirmWorkflowDelete(true)}
          >
            Delete Workflow
          </Button>
        </Box>

        <Typography color="text.secondary" mb={3}>
          {workflow.description}
        </Typography>

        {/* ===== PROGRESS DONUT ===== */}
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
              sx={{ color : getProgressColor(progress), position: "absolute" }}
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
            {workflow.tasks.filter((t) => t.status === "completed").length} /{" "}
            {workflow.tasks.length} tasks completed
          </Typography>
        </Box>

       {/* ===== ACTION BAR ===== */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            mb={3}
          >
            <Button
              variant="contained"
              onClick={() =>
                navigate(`/admin/workflows/${workflowId}/createTask`)
              }
            >
              + Add Task
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateSummary}
              disabled={loadingSummary}
            >
              {loadingSummary ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Generate AI Summary"
              )}
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* ===== AI SUMMARY CARD ===== */}
          {aiSummary && (
            <Box
              sx={{
                mb: 4,
                p: 3,
                bgcolor: "#f8fafc",
                border: "1px solid #e0e0e0",
                borderRadius: 3,
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={1}>
                AI Workflow Summary
              </Typography>

              <Typography
                whiteSpace="pre-line"
                sx={{ lineHeight: 1.7, color: "text.secondary" }}
              >
                {aiSummary}
              </Typography>
            </Box>
          )}
        {/* ===== TASK LIST ===== */}
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
                {users.map((u) => (
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
                onClick={() => setDeleteTaskId(task._id)}
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