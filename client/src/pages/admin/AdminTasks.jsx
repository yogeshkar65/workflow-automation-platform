import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Skeleton,
  Box,
  Typography,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import socket from "../../services/socket"; // ✅ added
import { showSuccess, showError } from "../../utils/toast";

/* ===== STATUS COLORS ===== */
const STATUS_COLORS = {
  pending: { bg: "#fdecea", color: "#d32f2f" },
  "in-progress": { bg: "#fff8e1", color: "#f9a825" },
  completed: { bg: "#e8f5e9", color: "#2e7d32" },
};

function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionText, setActionText] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const location = useLocation();
  const statusFilter = new URLSearchParams(location.search).get("status");

  /* ===== LOAD TASKS FUNCTION (extracted) ===== */
  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data || []);
    } catch {
      showError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  /* ===== INITIAL LOAD ===== */
  useEffect(() => {
    loadTasks();
  }, []);

  /* ===== SOCKET LISTENER ===== */
  useEffect(() => {
    socket.on("taskUpdated", () => {
      loadTasks();
    });

    return () => {
      socket.off("taskUpdated");
    };
  }, []);

  const filteredTasks = statusFilter
    ? tasks.filter((t) => t.status === statusFilter)
    : tasks;

  /* ===== CONFIRM DELETE ===== */
  const confirmDeleteTask = async () => {
    try {
      setActionText("Deleting task...");
      await api.delete(`/tasks/${deleteId}`);
      showSuccess("Task deleted successfully");
      // No manual state update — socket will refresh
    } catch {
      showError("Failed to delete task");
    } finally {
      setDeleteId(null);
      setActionText(null);
    }
  };

  /* ===== REST OF YOUR UI UNCHANGED ===== */
  /* ================= LOADING SKELETON ================= */
  if (loading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[1, 2, 3, 4].map((i) => (
                <TableCell key={i}>
                  <Skeleton width="60%" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                {[1, 2, 3, 4].map((j) => (
                  <TableCell key={j}>
                    <Skeleton height={24} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (filteredTasks.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h6" color="text.secondary">
          No tasks found
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* ===== CENTER LOADER ===== */}
      <Backdrop
        open={!!actionText}
        sx={{
          zIndex: 2000,
          backgroundColor: "rgba(255,255,255,0.6)",
        }}
      >
        <Box textAlign="center">
          <CircularProgress sx={{ color: "#1976d2" }} />
          <Typography mt={2} fontWeight={700} color="#1976d2">
            {actionText}
          </Typography>
        </Box>
      </Backdrop>

      {/* ===== DELETE CONFIRM DIALOG ===== */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={confirmDeleteTask}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== TASK TABLE ===== */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Task</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Assigned User</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTasks.map((task) => {
              const c = STATUS_COLORS[task.status];

              return (
                <TableRow
                  key={task._id}
                  hover
                  sx={{
                    transition: "0.2s",
                    "&:hover": { backgroundColor: "#f9fafb" },
                  }}
                >
                  <TableCell>{task.title}</TableCell>

                  <TableCell>
                    <Chip
                      label={task.status.replace("-", " ")}
                      sx={{
                        bgcolor: c.bg,
                        color: c.color,
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    {task.assignedTo?.name || "Unassigned"}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => setDeleteId(task._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default AdminTasks;
