import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";

/* ================= HELPERS ================= */
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

/* ================= SKELETON CARD ================= */
const WorkflowSkeleton = () => {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #eee",
      }}
    >
      <Skeleton variant="text" height={28} width="70%" />
      <Skeleton variant="text" height={18} width="40%" sx={{ mb: 3 }} />

      <Box display="flex" alignItems="center" gap={3}>
        <Skeleton variant="circular" width={90} height={90} />

        <Box flex={1}>
          <Skeleton variant="text" height={22} width="80%" />
          <Skeleton variant="text" height={16} width="60%" />
        </Box>
      </Box>
    </Card>
  );
};

export default function AdminWorkflows() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get("status");

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const res = await api.get("/workflows");
        setWorkflows(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, []);

  /* ================= FILTER LOGIC ================= */
  const filteredWorkflows = useMemo(() => {
    if (!statusFilter) return workflows;

    return workflows.filter((w) => {
      const tasks = w.tasks || [];

      if (statusFilter === "completed") {
        return tasks.length > 0 && tasks.every((t) => t.status === "completed");
      }

      if (statusFilter === "in-progress") {
        return (
          tasks.some((t) => t.status === "in-progress") &&
          !tasks.every((t) => t.status === "completed")
        );
      }

      if (statusFilter === "not-started") {
        return tasks.length === 0 || tasks.every((t) => t.status === "pending");
      }

      return true;
    });
  }, [workflows, statusFilter]);

  return (
    <Box p={3}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={800}>
          Workflows
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/admin/createWorkflow")}
        >
          + Create Workflow
        </Button>
      </Box>

      {/* GRID */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(320px, 1fr))"
        gap={3}
      >
        {/* LOADING STATE */}
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <WorkflowSkeleton key={i} />
          ))}

        {/* DATA STATE */}
        {!loading &&
          filteredWorkflows.map((w) => {
            const progress = getProgress(w.tasks || []);
            const color = getProgressColor(progress);

            return (
              <Card
                key={w._id}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  cursor: "pointer",
                  border: "1px solid #eee",
                  "&:hover": {
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  },
                }}
                onClick={() => navigate(`/admin/workflows/${w._id}`)}
              >
                <Typography fontWeight={800} mb={1}>
                  {w.title}
                </Typography>

                <Typography color="text.secondary" mb={3}>
                  {w.tasks?.length || 0} tasks
                </Typography>

                {/* DONUT */}
                <Box display="flex" alignItems="center" gap={3}>
                  <Box position="relative" display="inline-flex">
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={90}
                      thickness={6}
                      sx={{ color: "#e0e0e0" }}
                    />
                    <CircularProgress
                      variant="determinate"
                      value={progress}
                      size={90}
                      thickness={6}
                      sx={{
                        color,
                        position: "absolute",
                        left: 0,
                      }}
                    />
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography fontWeight={800} color={color}>
                        {progress}%
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography fontWeight={700}>
                      {w.tasks?.filter((t) => t.status === "completed").length ||
                        0}
                      {" / "}
                      {w.tasks?.length || 0} completed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Workflow progress
                    </Typography>
                  </Box>
                </Box>
              </Card>
            );
          })}
      </Box>

      {/* EMPTY STATE */}
      {!loading && filteredWorkflows.length === 0 && (
        <Typography textAlign="center" color="text.secondary" mt={5}>
          No workflows found for this status
        </Typography>
      )}
    </Box>
  );
}
