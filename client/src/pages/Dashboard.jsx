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
} from "@mui/material";

/* ===== STATUS CONFIG ===== */
const STATUS_ORDER = ["pending", "in-progress", "completed"];

const STATUS_COLORS = {
  pending: { bg: "#fdecea", color: "#d32f2f" },
  "in-progress": { bg: "#fff8e1", color: "#f9a825" },
  completed: { bg: "#e8f5e9", color: "#2e7d32" },
};

/* ===== HELPERS ===== */
const getProgress = (tasks = []) => {
  if (!tasks.length) return 0;
  const done = tasks.filter(t => t.status === "completed").length;
  return Math.round((done / tasks.length) * 100);
};

const getProgressColor = (v) => {
  if (v < 30) return "#d32f2f";
  if (v < 60) return "#f9a825";
  if (v < 90) return "#81c784";
  return "#2e7d32";
};

const isBlocked = (task, tasks) => {
  if (task.order === 1) return false;
  const prev = tasks.find(t => t.order === task.order - 1);
  return prev && prev.status !== "completed";
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  /* ===== FETCH TASKS ===== */
  useEffect(() => {
    api.get("/tasks")
      .then(res => setTasks(res.data || []))
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  /* ===== KPI COUNTS ===== */
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const inProgress = tasks.filter(t => t.status === "in-progress").length;
  const completed = tasks.filter(t => t.status === "completed").length;

  /* ===== GROUP BY WORKFLOW ===== */
  const workflows = useMemo(() => {
    const map = {};
    tasks.forEach(task => {
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
    .map(w => ({
      ...w,
      tasks:
        filter === "all"
          ? w.tasks
          : w.tasks.filter(t => t.status === filter),
    }))
    .filter(w => w.tasks.length);

  /* ===== UPDATE STATUS ===== */
  const advanceStatus = async (task, wfTasks) => {
    if (isBlocked(task, wfTasks)) {
      setError("Previous task must be completed first");
      return;
    }

    const idx = STATUS_ORDER.indexOf(task.status);
    const next = STATUS_ORDER[idx + 1];
    if (!next) return;

    try {
      await api.put(`/tasks/${task._id}/status`, { status: next });
      setTasks(prev =>
        prev.map(t =>
          t._id === task._id ? { ...t, status: next } : t
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Status update failed");
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#f6f8fb", minHeight: "100vh", py: 4 }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>

        {/* HEADER */}
        <Typography variant="h4" fontWeight={800}>
          My Dashboard
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Tasks assigned to you
        </Typography>

        {/* ===== KPI CARDS (RESPONSIVE + CLICKABLE) ===== */}
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
            { key: "in-progress", label: "In Progress", value: inProgress, color: "#f9a825" },
            { key: "completed", label: "Completed", value: completed, color: "#2e7d32" },
          ].map(k => (
            <Card
              key={k.key}
              onClick={() => setFilter(k.key)}
              sx={{
                cursor: "pointer",
                borderLeft: `6px solid ${k.color}`,
                border:
                  filter === k.key
                    ? `2px solid ${k.color}`
                    : "2px solid transparent",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
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

        {/* ===== FILTER BUTTONS ===== */}
        <Box display="flex" gap={1} mb={4} flexWrap="wrap">
          {["all", "pending", "in-progress", "completed"].map(s => (
            <Button
              key={s}
              variant={filter === s ? "contained" : "outlined"}
              onClick={() => setFilter(s)}
            >
              {s.replace("-", " ")}
            </Button>
          ))}
        </Box>

        {/* ===== EMPTY STATE ===== */}
        {filteredWorkflows.length === 0 && (
          <Box textAlign="center" py={8} color="text.secondary">
            <Typography variant="h5" fontWeight={700}>
              🎉 You’re all caught up!
            </Typography>
            <Typography mt={1}>
              No {filter === "all" ? "" : filter.replace("-", " ")} tasks right now.
            </Typography>
          </Box>
        )}

        {/* ===== WORKFLOWS ===== */}
        {filteredWorkflows.map((wf, i) => {
          const progress = getProgress(wf.tasks);
          const color = getProgressColor(progress);

          return (
            <Card key={i} sx={{ mb: 4, borderRadius: 4 }}>
              <CardContent>

                {/* HEADER */}
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography fontWeight={800}>{wf.title}</Typography>

                  {/* DONUT */}
                  <Box
                    position="relative"
                    width={54}
                    height={54}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={54}
                      thickness={6}
                      sx={{ color: "#e0e0e0", position: "absolute" }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={progress}
                      size={54}
                      thickness={6}
                      sx={{ color, position: "absolute" }}
                    />
                    <Typography fontSize={12} fontWeight={700} color={color}>
                      {progress}%
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* TASKS */}
                {wf.tasks.map(task => {
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
                      <Typography fontWeight={600}>
                        {task.title}
                      </Typography>

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

      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")}>
        <Alert severity="warning">{error}</Alert>
      </Snackbar>
    </Box>
  );
}
