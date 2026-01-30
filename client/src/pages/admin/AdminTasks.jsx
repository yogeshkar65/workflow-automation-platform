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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
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
  const [actionLoading, setActionLoading] = useState(false);

  const location = useLocation();
  const statusFilter = new URLSearchParams(location.search).get("status");

  /* ===== LOAD TASKS ===== */
  useEffect(() => {
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

    loadTasks();
  }, []);

  const filteredTasks = statusFilter
    ? tasks.filter((t) => t.status === statusFilter)
    : tasks;

  /* ===== DELETE TASK ===== */
  const deleteTask = async (id) => {
    try {
      setActionLoading(true);
      showSuccess("Deleting task...");
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showSuccess("Task deleted successfully");
    } catch {
      showError("Failed to delete task");
    } finally {
      setActionLoading(false);
    }
  };

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

  /* ================= TABLE ================= */
  return (
    <>
      {/* GLOBAL ACTION LOADER */}
      <Backdrop open={actionLoading} sx={{ zIndex: 2000 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

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
                      disabled={actionLoading}
                      onClick={() => deleteTask(task._id)}
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
