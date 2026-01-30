import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Skeleton,
  Backdrop,
} from "@mui/material";
import { toast } from "react-toastify";

/* ===== STATUS FLOW ===== */
const STATUS_ORDER = ["pending", "in-progress", "completed"];

const STATUS_COLORS = {
  pending: { bg: "#fdecea", color: "#d32f2f" },
  "in-progress": { bg: "#fff8e1", color: "#f9a825" },
  completed: { bg: "#e8f5e9", color: "#2e7d32" },
};

const getProgress = (tasks = []) => {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.status === "completed").length;
  return Math.round((done / tasks.length) * 100);
};

const getProgressColor = (v) => {
  if (v <= 30) return "#d32f2f";
  if (v <= 50) return "#f9a825";
  if (v <= 80) return "#4262e1";
  return "#2e7d32";
};

const isBlocked = (task, tasks) => {
  if (task.order === 1) return false;
  const prev = tasks.find((t) => t.order === task.order - 1);
  return prev && prev.status !== "completed";
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [action, setAction] = useState(null);

  /* ===== FETCH TASKS ===== */
  useEffect(() => {
    api
      .get("/tasks")
      .then((res) => setTasks(res.data || []))
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  /* ===== STATS ===== */
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  /* ===== GROUP BY WORKFLOW ===== */
  const workflows = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (!task.workflow) return;
      const id = task.workflow._id;
      if (!map[id]) {
        map[id] = { title: task.workflow.title, tasks: [] };
      }
      map[id].tasks.push(task);
      map[id].tasks.sort((a, b) => a.order - b.order);
    });
    return Object.values(map);
  }, [tasks]);

  const filteredWorkflows = workflows
    .map((w) => ({
      ...w,
      tasks:
        filter === "all"
          ? w.tasks
          : w.tasks.filter((t) => t.status === filter),
    }))
    .filter((w) => w.tasks.length > 0);

  const hasAnyTasks = tasks.length > 0;
  const hasFilteredTasks = filteredWorkflows.length > 0;

  /* ===== STATUS UPDATE ===== */
  const advanceStatus = async (task, wfTasks) => {
    if (isBlocked(task, wfTasks)) {
      setError("Previous task must be completed first");
      return;
    }

    const idx = STATUS_ORDER.indexOf(task.status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];

    try {
      setAction("Updating status...");
      await api.put(`/tasks/${task._id}/status`, { status: next });
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, status: next } : t
        )
      );
      toast.success("Status updated");
    } catch {
      toast.error("Task update failed");
    } finally {
      setAction(null);
    }
  };

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", py: 4, px: 2 }}>
        <Skeleton width="40%" height={40} />
        <Skeleton width="60%" height={20} sx={{ mb: 4 }} />
      </Box>
    );
  }

  return (
    <>
      {/* ===== CENTER ACTION LOADER ===== */}
      <Backdrop
        open={!!action}
        sx={{ zIndex: 2000, background: "rgba(255,255,255,0.6)" }}
      >
        <Box textAlign="center">
          <CircularProgress sx={{ color: "#1976d2" }} />
          <Typography mt={2} fontWeight={700} color="#1976d2">
            {action}
          </Typography>
        </Box>
      </Backdrop>

      <Box sx={{ background: "#f6f8fb", minHeight: "100vh", py: 4 }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
          <Typography variant="h4" fontWeight={800}>
            My Dashboard
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Tasks assigned to you
          </Typography>

          {/* ===== STAT CARDS ===== */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit,minmax(220px,1fr))"
            gap={3}
            mb={4}
          >
            {[
              { key: "all", label: "All", value: total, color: "#1976d2" },
              { key: "pending", label: "Pending", value: pending, color: "#d32f2f" },
              {
                key: "in-progress",
                label: "In Progress",
                value: inProgress,
                color: "#f9a825",
              },
              {
                key: "completed",
                label: "Completed",
                value: completed,
                color: "#2e7d32",
              },
            ].map((k) => (
              <Card
                key={k.key}
                onClick={() => setFilter(k.key)}
                sx={{
                  cursor: "pointer",
                  borderLeft: `6px solid ${k.color}`,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h4" fontWeight={800} color={k.color}>
                    {k.value}
                  </Typography>
                  <Typography fontWeight={600}>{k.label}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* ===== EMPTY STATES ===== */}
          {!hasAnyTasks && (
            <Box textAlign="center" mt={8}>
              <Typography fontSize={56}>📭</Typography>
              <Typography variant="h6" fontWeight={700}>
                No tasks assigned yet
              </Typography>
              <Typography color="text.secondary">
                You’ll see tasks here once they’re assigned to you
              </Typography>
            </Box>
          )}

          {hasAnyTasks && !hasFilteredTasks && (
            <Box textAlign="center" mt={8}>
              <Typography fontSize={56}>🎉</Typography>
              <Typography variant="h6" fontWeight={800} color="#2e7d32">
                You’re all caught up!
              </Typography>
              <Typography color="text.secondary" mb={3}>
                No tasks in this category
              </Typography>
              <Button variant="contained" onClick={() => setFilter("pending")}>
                Go to Pending Tasks
              </Button>
            </Box>
          )}

          {/* ===== WORKFLOWS ===== */}
          {hasFilteredTasks &&
            filteredWorkflows.map((wf, i) => {
              const progress = getProgress(wf.tasks);
              const color = getProgressColor(progress);

              return (
                <Card key={i} sx={{ mb: 4, borderRadius: 4 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography fontWeight={800}>{wf.title}</Typography>

                      <Box position="relative" width={54} height={54}>
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={54}
                          sx={{ color: "#e0e0e0", position: "absolute" }}
                        />
                        <CircularProgress
                          variant="determinate"
                          value={progress}
                          size={54}
                          sx={{ color, position: "absolute" }}
                        />
                        <Typography
                          sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 12,
                            color,
                          }}
                        >
                          {progress}%
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {wf.tasks.map((task) => {
                      const blocked = isBlocked(task, wf.tasks);
                      const c = STATUS_COLORS[task.status];

                      return (
                        <Box
                          key={task._id}
                          display="flex"
                          justifyContent="space-between"
                          mb={2}
                          sx={{ opacity: blocked ? 0.5 : 1 }}
                        >
                          <Typography fontWeight={600}>{task.title}</Typography>

                          {blocked ? (
                            <Chip label="Blocked" />
                          ) : (
                            <Chip
                              label={task.status.replace("-", " ")}
                              clickable
                              onClick={() =>
                                advanceStatus(task, wf.tasks)
                              }
                              sx={{
                                bgcolor: c.bg,
                                color: c.color,
                                fontWeight: 700,
                              }}
                            />
                          )}
                        </Box>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
        </Box>

        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={() => setError("")}
        >
          <Alert severity="warning">{error}</Alert>
        </Snackbar>
      </Box>
    </>
  );
}
