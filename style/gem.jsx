import { useEffect, useState } from "react";
import {
  Grid, Card, CardContent, Typography, Box, List, 
  ListItem, ListItemText, Divider, Chip
} from "@mui/material";
import {
  WorkOutline, PendingActions, AssignmentTurnedIn, 
  HourglassEmpty, PlaylistAddCheck, ArrowForward, MoreHoriz
} from "@mui/icons-material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

// SET YOUR EXACT WEBSITE BLUE HERE
const WEBSITE_BLUE = "#1976d2"; 
const LIGHT_BLUE_BG = "#f0f7ff";
const BORDER_COLOR = "#eef2f6";

function AdminDashboard() {
  const [workflows, setWorkflows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/workflows").then((res) => setWorkflows(res.data)).catch(() => {});
  }, []);

  const total = workflows.length || 3;
  const inProgress = workflows.filter(w => w.status === "in-progress").length || 3;
  const completed = workflows.filter(w => w.status === "completed").length || 0;
  const notStarted = total - (inProgress + completed);

  const stats = [
    { label: "Total Workflows", value: total, icon: <WorkOutline /> },
    { label: "In Progress", value: inProgress, icon: <PendingActions /> },
    { label: "Completed", value: completed, icon: <AssignmentTurnedIn /> },
    { label: "Not Started", value: notStarted, icon: <HourglassEmpty /> },
    { label: "Pending Tasks", value: 3, icon: <PlaylistAddCheck /> },
  ];

  const chartData = [
    { name: "Completed", value: completed, color: "#4caf50" }, 
    { name: "In Progress", value: inProgress, color: WEBSITE_BLUE },
    { name: "Not Started", value: notStarted, color: "#cfd8dc" },
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: "#ffffff", minHeight: "100vh" }}>
      
      {/* HEADER SECTION */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color={WEBSITE_BLUE}>Admin Panel</Typography>
        <Typography variant="body1" color="text.secondary">Overview of all workflows and tasks</Typography>
      </Box>

      {/* ROW 1: KPI CARDS (Full Width Distribution) */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card elevation={0} sx={{ border: `1px solid ${BORDER_COLOR}`, borderRadius: 3 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ color: WEBSITE_BLUE, bgcolor: LIGHT_BLUE_BG, p: 1, borderRadius: 2, display: 'flex' }}>
                    {stat.icon}
                  </Box>
                  <MoreHoriz sx={{ color: "#bdc3c7" }} />
                </Box>
                <Typography variant="h4" fontWeight="800" color={WEBSITE_BLUE}>{stat.value}</Typography>
                <Typography variant="caption" fontWeight="700" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ROW 2: THE DONUT (Full Row, Expressive Design) */}
      <Card elevation={0} sx={{ border: `1px solid ${BORDER_COLOR}`, borderRadius: 4, mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight="700" color={WEBSITE_BLUE} sx={{ mb: 4 }}>Workflow Status Overview</Typography>
          <Grid container alignItems="center" spacing={4}>
            {/* Donut Container */}
            <Grid item xs={12} md={5} sx={{ height: 320, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={90}
                    outerRadius={125}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Total Text */}
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="800" color={WEBSITE_BLUE}>{total}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="600">Total</Typography>
              </Box>
            </Grid>

            {/* Expressive Legend Detail */}
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: { md: 4 } }}>
                {chartData.map((item, i) => (
                  <Box key={i} sx={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    p: 2, bgcolor: LIGHT_BLUE_BG, borderRadius: 3, border: '1px solid #eef6ff'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color, mr: 2 }} />
                      <Typography variant="subtitle1" fontWeight="700" color={WEBSITE_BLUE}>{item.name}</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="800" color={WEBSITE_BLUE}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ROW 3: RECENT WORKFLOWS (Full Row) */}
      <Card elevation={0} sx={{ border: `1px solid ${BORDER_COLOR}`, borderRadius: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight="700" color={WEBSITE_BLUE}>Recent Workflows</Typography>
            <Typography 
              variant="subtitle2" 
              color={WEBSITE_BLUE} 
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 700 }}
              onClick={() => navigate("/admin/workflows")}
            >
              View all <ArrowForward sx={{ fontSize: 16, ml: 0.5 }} />
            </Typography>
          </Box>
          <List disablePadding>
            {(workflows.length > 0 ? workflows : [1, 2, 3]).slice(0, 3).map((w, index) => (
              <Box key={index}>
                <ListItem sx={{ py: 2, px: 1 }}>
                  <Box sx={{ 
                    width: 40, height: 40, borderRadius: '50%', bgcolor: WEBSITE_BLUE, color: '#fff', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3, fontWeight: 700
                  }}>
                    {index + 1}
                  </Box>
                  <ListItemText 
                    primary={<Typography variant="subtitle1" fontWeight="700" color={WEBSITE_BLUE}>{w.title || "Employee Onboarding"}</Typography>}
                    secondary="2 tasks assigned"
                  />
                  <Chip label="In Progress" size="small" sx={{ bgcolor: WEBSITE_BLUE, color: '#fff', fontWeight: 700 }} />
                </ListItem>
                {index < 2 && <Divider sx={{ opacity: 0.5 }} />}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AdminDashboard;