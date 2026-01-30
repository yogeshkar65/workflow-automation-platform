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

  // 🔥 inline feedback per task
  const [statusFeedback, setStatusFeedback] = useState({});

  /* ===== FETCH TASKS ===== */
  useEffect(() => {
    api
      .get("/tasks")
      .then((res) => setTasks(res.data || []))
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

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

  /* ===== STATUS UPDATE ===== */
  const advanceStatus = async (task, wfTasks) => {
    if (isBlocked(task, wfTasks)) {
      setError("Previous task must be completed first");
      return;
    }

    const idx = STATUS_ORDER.indexOf(task.status);
    const next = STATUS_ORDER[idx + 1];
    if (!next) return;

    try {
      setAction("Updating status...");
      await api.put(`/tasks/${task._id}/status`, { status: next });

      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, status: next } : t
        )
      );

      // 👇 inline feedback
      setStatusFeedback((prev) => ({
        ...prev,
        [task._id]: `Moved to ${next.replace("-", " ")}`,
      }));

      // auto-clear feedback
      setTimeout(() => {
        setStatusFeedback((prev) => {
          const copy = { ...prev };
          delete copy[task._id];
          return copy;
        });
      }, 2000);
    } catch {
      setError("Task update failed");
    } finally {
      setAction(null);
    }
  };

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", py: 4 }}>
        <Skeleton width="40%" height={40} />
        <Skeleton width="60%" height={20} />
      </Box>
    );
  }

  return (
    <>
      {/* ===== CENTER LOADER ===== */}
      <Backdrop
        open={!!action}
        sx={{ zIndex: 2000, background: "rgba(255,255,255,0.6)" }}
      >
        <Box textAlign="center">
          <CircularProgress sx={{ color: "#1976d2" }} />
          <Typography mt={2} fontWeight={700}>
            {action}
          </Typography>
        </Box>
      </Backdrop>

      <Box sx={{ background: "#f6f8fb", minHeight: "100vh", py: 4 }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
          <Typography variant="h4" fontWeight={800}>
            My Dashboard
          </Typography>

          {/* FILTERS */}
          <Box display="flex" gap={1} my={3}>
            {["all", "pending", "in-progress", "completed"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "contained" : "outlined"}
                onClick={() => setFilter(f)}
              >
                {f.replace("-", " ")}
              </Button>
            ))}
          </Box>

          {/* WORKFLOWS */}
          {filteredWorkflows.map((wf) => (
            <Card key={wf.title} sx={{ mb: 4, borderRadius: 4 }}>
              <CardContent>
                <Typography fontWeight={800}>{wf.title}</Typography>
                <Divider sx={{ my: 2 }} />

                {wf.tasks.map((task) => {
                  const blocked = isBlocked(task, wf.tasks);
                  const c = STATUS_COLORS[task.status];

                  return (
                    <Box
                      key={task._id}
                      sx={{
                        mb: 2,
                        p: 1,
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": { background: "#f9fafb" },
                      }}
                    >
                      <Box display="flex" justifyContent="space-between">
                        <Typography fontWeight={600}>
                          {task.title}
                        </Typography>

                        <Chip
                          label={task.status.replace("-", " ")}
                          clickable={!blocked}
                          onClick={() =>
                            !blocked && advanceStatus(task, wf.tasks)
                          }
                          sx={{
                            bgcolor: c.bg,
                            color: c.color,
                            fontWeight: 700,
                            transition: "transform 0.2s",
                            "&:active": { transform: "scale(0.95)" },
                          }}
                        />
                      </Box>

                      {/* 👇 INLINE FEEDBACK */}
                      {statusFeedback[task._id] && (
                        <Typography
                          fontSize={12}
                          color="text.secondary"
                          mt={0.5}
                        >
                          {statusFeedback[task._id]}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          ))}
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
