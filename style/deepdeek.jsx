import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  WorkOutline,
  PendingActions,
  AssignmentTurnedIn,
  HourglassEmpty,
  PlaylistAddCheck,
} from "@mui/icons-material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

/* ================= THEME ================= */
const BLUE = "#1976d2";
const BG = "#f5f7fb";
const CHART_COLORS = ["#1976d2", "#64b5f6", "#bbdefb"];

/* ================= ICON MAP ================= */
const icons = {
  "Total Workflows": <WorkOutline />,
  "In Progress": <PendingActions />,
  "Completed": <AssignmentTurnedIn />,
  "Not Started": <HourglassEmpty />,
  "Pending Tasks": <PlaylistAddCheck />,
};

function AdminDashboard() {
  const [workflows, setWorkflows] = useState([]);
  const navigate = useNavigate();

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    api.get("/workflows").then((res) => setWorkflows(res.data));
  }, []);

  /* ================= CALCULATIONS ================= */
  let total = workflows.length;
  let completed = 0;
  let inProgress = 0;
  let notStarted = 0;
  let pendingTasks = 0;

  workflows.forEach((w) => {
    const tasks = w.tasks || [];
    const done = tasks.filter((t) => t.status === "completed").length;

    pendingTasks += tasks.length - done;

    if (done === 0) notStarted++;
    else if (done === tasks.length) completed++;
    else inProgress++;
  });

  const stats = [
    { label: "Total Workflows", value: total },
    { label: "In Progress", value: inProgress },
    { label: "Completed", value: completed },
    { label: "Not Started", value: notStarted },
    { label: "Pending Tasks", value: pendingTasks },
  ];

  const chartData = [
    { name: "Completed", value: completed },
    { name: "In Progress", value: inProgress },
    { name: "Not Started", value: notStarted },
  ];

  return (
    <Box
      sx={{
        backgroundColor: BG,
        minHeight: "100vh",
        px: { xs: 2, sm: 4 },
        py: { xs: 3, sm: 4 },
      }}
    >
      {/* ================= TITLE ================= */}
      <Typography variant="h5" fontWeight={600} mb={3}>
        Admin Dashboard
      </Typography>

      {/* ================= KPI CARDS ================= */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={stat.label}>
            <Card
              sx={{
                height: 130,
                borderRadius: 3,
                cursor: "pointer",
                borderLeft: `4px solid ${BLUE}`,
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(25,118,210,0.15)",
                },
              }}
              onClick={() => navigate("/admin/workflows")}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Box sx={{ color: BLUE, fontSize: 26 }}>
                    {icons[stat.label]}
                  </Box>
                  <Typography variant="h4" fontWeight={600} color={BLUE}>
                    {stat.value}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= SECOND ROW ================= */}
      <Grid container spacing={4} alignItems="stretch">
        {/* ===== DONUT ===== */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h6" fontWeight={600} mb={3}>
                Workflow Progress Breakdown
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: 320,
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={2}
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={CHART_COLORS[index]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} workflow${value !== 1 ? "s" : ""}`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ===== RECENT WORKFLOWS ===== */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: "100%", borderRadius: 3 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight={600}>
                  Recent Workflows
                </Typography>
                <Typography
                  variant="body2"
                  color={BLUE}
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate("/admin/workflows")}
                >
                  View all
                </Typography>
              </Box>

              <List>
                {workflows.slice(0, 5).map((w, index) => (
                  <Box key={w._id}>
                    <ListItem
                      sx={{
                        cursor: "pointer",
                        borderRadius: 2,
                        "&:hover": { backgroundColor: "#f0f4ff" },
                      }}
                      onClick={() =>
                        navigate(`/admin/workflows/${w._id}`)
                      }
                    >
                      <ListItemText
                        primary={w.title}
                        secondary={`${w.tasks?.length || 0} tasks`}
                      />
                    </ListItem>
                    {index < 4 && <Divider />}
                  </Box>
                ))}

                {workflows.length === 0 && (
                  <Typography
                    textAlign="center"
                    color="text.secondary"
                    sx={{ py: 4 }}
                  >
                    No workflows found
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
