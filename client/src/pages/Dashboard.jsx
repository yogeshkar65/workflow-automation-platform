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
} from "@mui/material";

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
  if (v <= 50) return "#e29f33";
  if (v <= 80) return "#4262e1";
  if (v < 90) return "#81c784";
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

  /* ===== FETCH TASKS ===== */
  useEffect(() => {
    api
      .get("/tasks")
      .then((res) => setTasks(res.data || []))
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  /* =====================================================
     ALL DERIVED LOGIC & HOOKS — MUST BE ABOVE RETURNS
     ===================================================== */

  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  const workflows = useMemo(() => {
    if (!tasks.length) return [];

    const map = {};
    tasks.forEach((task) => {
      if (!task.workflow) return;

      const wfId = task.workflow._id;
      if (!map[wfId]) {
        map[wfId] = {
          title: task.workflow.title,
          tasks: [],
        };
      }
      map[wfId].tasks.push(task);
      map[wfId].tasks.sort((a, b) => a.order - b.order);
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

  const advanceStatus = async (task, wfTasks) => {
    if (isBlocked(task, wfTasks)) {
      setError("Previous task must be completed first");
      return;
    }

    const idx = STATUS_ORDER.indexOf(task.status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];

    try {
      await api.put(`/tasks/${task._id}/status`, { status: next });
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, status: next } : t
        )
      );
    } catch {
      setError("Status update failed");
    }
  };

  /* ================= SKELETON UI ================= */
  if (loading) {
    return (
      <Box sx={{ background: "#f6f8fb", minHeight: "100vh", py: 4 }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
          <Skeleton width="40%" height={40} />
          <Skeleton width="60%" height={20} sx={{ mb: 4 }} />

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            }}
            gap={3}
            mb={4}
          >
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent>
                  <Skeleton height={40} width="50%" />
                  <Skeleton height={20} width="70%" />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <Box sx={{ background: "#f6f8fb", minHeight: "100vh", py: 4 }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
        <Typography variant="h4" fontWeight={800}>
          My Dashboard
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Tasks assigned to you
        </Typography>

        {/* STAT CARDS */}
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          }}
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

        {/* WORKFLOWS */}
        {filteredWorkflows.length === 0 && (
          <Typography color="text.secondary" mt={6} textAlign="center">
            No tasks available
          </Typography>
        )}

        {filteredWorkflows.map((wf, i) => {
          const progress = getProgress(wf.tasks);
          const color = getProgressColor(progress);

          return (
            <Card key={i} sx={{ mb: 4, borderRadius: 4 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography fontWeight={800}>{wf.title}</Typography>

                  <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={54}
                    thickness={6}
                    sx={{ color }}
                  />
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
                          onClick={() => advanceStatus(task, wf.tasks)}
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
  );
}
