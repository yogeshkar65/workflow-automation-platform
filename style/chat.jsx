import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  WorkOutline,
  PendingActions,
  AssignmentTurnedIn,
  HourglassEmpty,
  PlaylistAddCheck,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

/* ================= COLORS ================= */
const BLUE = "#1976d2";
const LIGHT_BLUE = "#f0f7ff";
const BORDER = "#eef2f6";

/* ================= KPI CONFIG ================= */
const statsConfig = [
  { label: "Total Workflows", icon: <WorkOutline /> },
  { label: "In Progress", icon: <PendingActions /> },
  { label: "Completed", icon: <AssignmentTurnedIn /> },
  { label: "Not Started", icon: <HourglassEmpty /> },
  { label: "Pending Tasks", icon: <PlaylistAddCheck /> },
];

export default function AdminDashboard() {
  const [workflows, setWorkflows] = useState([]);
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0, 0]);
  const navigate = useNavigate();

  /* ================= FETCH ================= */
  useEffect(() => {
    api
      .get("/workflows")
      .then(res => setWorkflows(res.data || []))
      .catch(() => setWorkflows([]));
  }, []);

  /* ================= CALCULATIONS ================= */
  const total = workflows.length;

  const completed = workflows.filter(
    w => w.tasks?.length && w.tasks.every(t => t.status === "completed")
  ).length;

  const inProgress = workflows.filter(
    w =>
      w.tasks?.some(t => t.status === "completed") &&
      !w.tasks.every(t => t.status === "completed")
  ).length;

  const notStarted = Math.max(total - completed - inProgress, 0);

  const pendingTasks = workflows.reduce(
    (sum, w) =>
      sum + (w.tasks?.filter(t => t.status !== "completed").length || 0),
    0
  );

  const statsValues = useMemo(
    () => [total, inProgress, completed, notStarted, pendingTasks],
    [total, inProgress, completed, notStarted, pendingTasks]
  );

  /* ================= COUNT-UP ================= */
  useEffect(() => {
    let frame = 0;
    const steps = 20;
    const timer = setInterval(() => {
      frame++;
      setAnimatedValues(
        statsValues.map(v => Math.round((v / steps) * frame))
      );
      if (frame === steps) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [statsValues]);

  return (
    /* 🔥 FIXED SPACING HERE */
    <Box
      sx={{
        px: 4,       // left & right spacing
        pt: 2,       // reduced top spacing
        pb: 4,       // bottom spacing
        background: "#f9fbfd",
        minHeight: "100vh",
      }}
    >
      {/* ================= HEADER ================= */}
      <Typography variant="h4" fontWeight={800} color={BLUE}>
        Admin Panel
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Overview of all workflows and tasks
      </Typography>

      {/* ================= KPI CARDS ================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(5, 1fr)",
          },
          gap: 2.5,
          mb: 5,
        }}
      >
        {statsConfig.map((item, i) => (
          <Card
            key={item.label}
            elevation={0}
            onClick={() => navigate("/admin/workflows")}
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: 3,
              cursor: "pointer",
              background: "#fff",
              transition: "all .25s ease",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 14px 30px rgba(25,118,210,0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  bgcolor: LIGHT_BLUE,
                  color: BLUE,
                  p: 1.2,
                  borderRadius: 2,
                  width: "fit-content",
                  mb: 2,
                }}
              >
                {item.icon}
              </Box>

              <Typography variant="h3" fontWeight={800} color={BLUE}>
                {animatedValues[i]}
              </Typography>

              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ color: BLUE, textTransform: "uppercase" }}
              >
                {item.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* ================= RECENT WORKFLOWS ================= */}
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${BORDER}`,
          borderRadius: 4,
          background: "#fff",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6" fontWeight={800} color={BLUE}>
              Recent Workflows
            </Typography>
            <Typography
              color={BLUE}
              fontWeight={700}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              onClick={() => navigate("/admin/workflows")}
            >
              View all <ArrowForward sx={{ fontSize: 16, ml: 0.5 }} />
            </Typography>
          </Box>

          <List disablePadding>
            {(workflows.length ? workflows : [1, 2, 3]).slice(0, 3).map((w, i) => (
              <Box key={i}>
                <ListItem sx={{ py: 2 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      bgcolor: BLUE,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 3,
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </Box>

                  <ListItemText
                    primary={
                      <Typography fontWeight={700} color={BLUE}>
                        {w.title || "Employee Onboarding"}
                      </Typography>
                    }
                    secondary="2 tasks assigned"
                  />

                  <Chip
                    label="In Progress"
                    size="small"
                    sx={{
                      bgcolor: LIGHT_BLUE,
                      color: BLUE,
                      fontWeight: 700,
                    }}
                  />
                </ListItem>
                {i < 2 && <Divider />}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
