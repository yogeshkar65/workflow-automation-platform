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
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const BLUE = "#1976d2";
const BG = "#f5f7fb";

/* ===== ICON MAP ===== */
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

  useEffect(() => {
    api.get("/workflows").then((res) => setWorkflows(res.data));
  }, []);

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
    <Box sx={{ backgroundColor: BG, minHeight: "100vh", p: 3 }}>
      {/* ================= KPI CARDS ================= */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={stat.label}>
            <Card
              sx={{
                borderRadius: 3,
                height: 130,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
              }}
              onClick={() => navigate("/admin/workflows")}
            >
              <CardContent>
                <Box
                  sx={{
                    color: BLUE,
                    mb: 1,
                    fontSize: 28,
                  }}
                >
                  {icons[stat.label]}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>

                <Typography variant="h4" fontWeight="bold" color={BLUE}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= SECOND ROW ================= */}
      <Grid container spacing={4}>
        {/* ===== DONUT ===== */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" mb={3}>
                Workflow Status Overview
              </Typography>

              <Box display="flex" justifyContent="center">
                <PieChart width={320} height={320}>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={120}
                  >
                    <Cell fill={BLUE} />
                    <Cell fill={`${BLUE}AA`} />
                    <Cell fill={`${BLUE}66`} />
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      `${name} Workflows`,
                    ]}
                  />
                </PieChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ===== RECENT WORKFLOWS ===== */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Recent Workflows
              </Typography>

              <List>
                {workflows.slice(0, 5).map((w) => (
                  <Box key={w._id}>
                    <ListItem
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f0f4ff" },
                      }}
                      onClick={() =>
                        navigate(`/admin/workflows/${w._id}`)
                      }
                    >
                      <ListItemText
                        primary={w.title}
                        secondary={`${w.tasks.length} tasks`}
                      />
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;



import { AppBar, Toolbar, Button, Typography} from "@mui/material"
import { Link } from "react-router-dom";

function Navbar (){
    return (
       <AppBar position = "static">
            <Toolbar>
                <Typography 
                    variant="h6"
                    component= "div"
                    sx = {{flexGrow : 1}}
                >
                    Workflow Automation
                </Typography>
            <Button color="inherit" component ={Link} to="/">Home</Button>
            <Button color = "inherit" component = {Link}  to ="/login">Login</Button>
            <Button color = "inherit" component = {Link}  to ="/dashboard">DashBoard</Button>
            </Toolbar>
       </AppBar>
    )
}
export default Navbar;