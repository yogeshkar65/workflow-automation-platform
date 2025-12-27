
// import { useEffect, useState, useMemo } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   Chip,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import {
//   WorkOutline,
//   PendingActions,
//   AssignmentTurnedIn,
//   HourglassEmpty,
//   PlaylistAddCheck,
//   ArrowForward,
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";

// /* ===== COLORS ===== */
// const COLORS = {
//   blue: "#1976d2",
//   yellow: "#f9a825",
//   green: "#2e7d32",
//   red: "#d32f2f",
//   grey: "#9e9e9e",
//   lightBorder: "#eef2f6",
// };

// const PAGE_SIZE = 3;

// export default function AdminDashboard() {
//   const [workflows, setWorkflows] = useState([]);
//   const [page, setPage] = useState(1);
//   const navigate = useNavigate();

//   /* ===== FETCH ===== */
//   useEffect(() => {
//     api.get("/workflows")
//       .then(res => setWorkflows(res.data || []))
//       .catch(() => setWorkflows([]));
//   }, []);

//   /* ===== CALCULATIONS ===== */
//   const totalWorkflows = workflows.length;

//   const completedWorkflows = workflows.filter(
//     w => w.tasks?.length > 0 && w.tasks.every(t => t.status === "completed")
//   ).length;

//   const inProgressWorkflows = workflows.filter(
//     w => w.tasks?.some(t => t.status === "in-progress")
//   ).length;

//   const notStartedWorkflows = workflows.filter(w => {
//     if (!w.tasks || w.tasks.length === 0) return true;
//     return w.tasks.every(t => t.status === "pending");
//   }).length;

//   const pendingTasks = workflows.reduce(
//     (sum, w) =>
//       sum + (w.tasks?.filter(t => t.status === "pending").length || 0),
//     0
//   );

//   const stats = useMemo(() => ([
//     {
//       label: "Total Workflows",
//       value: totalWorkflows,
//       color: COLORS.blue,
//       icon: <WorkOutline />,
//       route: "/admin/workflows",
//       percent: 100,
//     },
//     {
//       label: "In Progress",
//       value: inProgressWorkflows,
//       color: COLORS.yellow,
//       icon: <PendingActions />,
//       route: "/admin/workflows?status=in-progress",
//       percent: totalWorkflows ? (inProgressWorkflows / totalWorkflows) * 100 : 0,
//     },
//     {
//       label: "Completed",
//       value: completedWorkflows,
//       color: COLORS.green,
//       icon: <AssignmentTurnedIn />,
//       route: "/admin/workflows?status=completed",
//       percent: totalWorkflows ? (completedWorkflows / totalWorkflows) * 100 : 0,
//     },
//     {
//       label: "Not Started",
//       value: notStartedWorkflows,
//       color: COLORS.grey,
//       icon: <HourglassEmpty />,
//       route: "/admin/workflows?status=not-started",
//       percent: totalWorkflows ? (notStartedWorkflows / totalWorkflows) * 100 : 0,
//     },
//     {
//       label: "Pending Tasks",
//       value: pendingTasks,
//       color: COLORS.red,
//       icon: <PlaylistAddCheck />,
//       route: "/admin/tasks?status=pending",
//       percent: pendingTasks ? 100 : 0,
//     },
//   ]), [
//     totalWorkflows,
//     inProgressWorkflows,
//     completedWorkflows,
//     notStartedWorkflows,
//     pendingTasks,
//   ]);

//   /* ===== PAGINATION ===== */
//   const totalPages = Math.ceil(workflows.length / PAGE_SIZE);
//   const paginated = workflows.slice(
//     (page - 1) * PAGE_SIZE,
//     page * PAGE_SIZE
//   );

//   return (
//     <Box sx={{ px: 4, pt: 1, pb: 4, background: "#f9fbfd", minHeight: "100vh" }}>
//       <Typography variant="h4" fontWeight={800} color={COLORS.blue}>
//         Admin Panel
//       </Typography>
//       <Typography color="text.secondary" mb={3}>
//         Overview of workflows and tasks
//       </Typography>

//       {/* ===== KPI CARDS WITH DONUT ===== */}
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(5,1fr)" },
//           gap: 2.5,
//           mb: 5,
//         }}
//       >
//         {stats.map(stat => (
//           <Card
//             key={stat.label}
//             elevation={0}
//             onClick={() => navigate(stat.route)}
//             sx={{
//               border: `1px solid ${COLORS.lightBorder}`,
//               borderRadius: 3,
//               cursor: "pointer",
//               "&:hover": {
//                 transform: "translateY(-4px)",
//                 boxShadow: "0 12px 25px rgba(0,0,0,0.12)",
//               },
//             }}
//           >
//             <CardContent>
//               <Box display="flex" justifyContent="space-between" alignItems="center">
//                 <Box sx={{ color: stat.color }}>{stat.icon}</Box>

//                 {/* DONUT */}
//                 <Box position="relative">
//                   <CircularProgress
//                     variant="determinate"
//                     value={100}
//                     size={44}
//                     thickness={5}
//                     sx={{ color: "#e0e0e0" }}
//                   />
//                   <CircularProgress
//                     variant="determinate"
//                     value={stat.percent}
//                     size={44}
//                     thickness={5}
//                     sx={{
//                       color: stat.color,
//                       position: "absolute",
//                       left: 0,
//                     }}
//                   />
//                 </Box>
//               </Box>

//               <Typography variant="h4" fontWeight={800} color={stat.color} mt={1}>
//                 {stat.value}
//               </Typography>
//               <Typography variant="caption" fontWeight={700} color={stat.color}>
//                 {stat.label}
//               </Typography>
//             </CardContent>
//           </Card>
//         ))}
//       </Box>

//       {/* ===== RECENT WORKFLOWS ===== */}
//       <Card elevation={0} sx={{ border: `1px solid ${COLORS.lightBorder}`, borderRadius: 4 }}>
//         <CardContent>
//           <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
//             <Typography variant="h6" fontWeight={800}>
//               Recent Workflows
//             </Typography>
//             <Typography
//               fontWeight={700}
//               sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
//               onClick={() => navigate("/admin/workflows")}
//             >
//               View all <ArrowForward sx={{ fontSize: 16, ml: 0.5 }} />
//             </Typography>
//           </Box>

//           <List disablePadding>
//             {paginated.map((w, i) => {
//               let status = "pending";
//               if (w.tasks?.some(t => t.status === "in-progress")) status = "in-progress";
//               if (w.tasks?.length && w.tasks.every(t => t.status === "completed")) status = "completed";

//               const chipColor =
//                 status === "completed" ? COLORS.green :
//                 status === "in-progress" ? COLORS.yellow :
//                 COLORS.red;

//               return (
//                 <Box key={w._id}>
//                   <ListItem>
//                     <ListItemText
//                       primary={<Typography fontWeight={700}>{w.title}</Typography>}
//                       secondary={`${w.tasks?.length || 0} tasks`}
//                     />
//                     <Chip
//                       label={status}
//                       sx={{
//                         bgcolor: chipColor,
//                         color: "#fff",
//                         fontWeight: 700,
//                       }}
//                     />
//                   </ListItem>
//                   {i < paginated.length - 1 && <Divider />}
//                 </Box>
//               );
//             })}
//           </List>

//           {totalPages > 1 && (
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//               <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
//               <Typography sx={{ mx: 2 }}>{page} / {totalPages}</Typography>
//               <Button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
//             </Box>
//           )}
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button,
  CircularProgress,
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

/* ===== COLORS ===== */
const COLORS = {
  blue: "#1976d2",
  yellow: "#f9a825",
  green: "#2e7d32",
  red: "#d32f2f",
  grey: "#9e9e9e",
  lightBorder: "#eef2f6",
};

const PAGE_SIZE = 3;

export default function AdminDashboard() {
  const [workflows, setWorkflows] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  /* ===== FETCH ===== */
  useEffect(() => {
    api.get("/workflows")
      .then(res => setWorkflows(res.data || []))
      .catch(() => setWorkflows([]));
  }, []);

  /* ===== CALCULATIONS ===== */
  const totalWorkflows = workflows.length;

  const completedWorkflows = workflows.filter(
    w => w.tasks?.length > 0 && w.tasks.every(t => t.status === "completed")
  ).length;

  const inProgressWorkflows = workflows.filter(
    w => w.tasks?.some(t => t.status === "in-progress")
  ).length;

  const notStartedWorkflows = workflows.filter(w => {
    if (!w.tasks || w.tasks.length === 0) return true;
    return w.tasks.every(t => t.status === "pending");
  }).length;

  const pendingTasks = workflows.reduce(
    (sum, w) =>
      sum + (w.tasks?.filter(t => t.status === "pending").length || 0),
    0
  );

  const stats = useMemo(() => ([
    {
      label: "Total Workflows",
      value: totalWorkflows,
      color: COLORS.blue,
      icon: <WorkOutline />,
      route: "/admin/workflows",
      percent: 100,
    },
    {
      label: "In Progress",
      value: inProgressWorkflows,
      color: COLORS.yellow,
      icon: <PendingActions />,
      route: "/admin/workflows?status=in-progress",
      percent: totalWorkflows ? (inProgressWorkflows / totalWorkflows) * 100 : 0,
    },
    {
      label: "Completed",
      value: completedWorkflows,
      color: COLORS.green,
      icon: <AssignmentTurnedIn />,
      route: "/admin/workflows?status=completed",
      percent: totalWorkflows ? (completedWorkflows / totalWorkflows) * 100 : 0,
    },
    {
      label: "Not Started",
      value: notStartedWorkflows,
      color: COLORS.grey,
      icon: <HourglassEmpty />,
      route: "/admin/workflows?status=not-started",
      percent: totalWorkflows ? (notStartedWorkflows / totalWorkflows) * 100 : 0,
    },
    {
      label: "Pending Tasks",
      value: pendingTasks,
      color: COLORS.red,
      icon: <PlaylistAddCheck />,
      route: "/admin/tasks?status=pending",
      percent: pendingTasks ? 100 : 0,
    },
  ]), [
    totalWorkflows,
    inProgressWorkflows,
    completedWorkflows,
    notStartedWorkflows,
    pendingTasks,
  ]);

  /* ===== PAGINATION ===== */
  const totalPages = Math.ceil(workflows.length / PAGE_SIZE);
  const paginated = workflows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <Box sx={{ px: 4, pt: 1, pb: 4, background: "#f9fbfd", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={800} color={COLORS.blue}>
        Admin Panel
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Overview of workflows and tasks
      </Typography>

      {/* ===== KPI CARDS WITH DONUT ===== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(5,1fr)" },
          gap: 2.5,
          mb: 5,
        }}
      >
        {stats.map(stat => (
          <Card
            key={stat.label}
            elevation={0}
            onClick={() => navigate(stat.route)}
            sx={{
              border: `1px solid ${COLORS.lightBorder}`,
              borderRadius: 3,
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 25px rgba(0,0,0,0.12)",
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box sx={{ color: stat.color }}>{stat.icon}</Box>

                {/* DONUT */}
                <Box position="relative">
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={44}
                    thickness={5}
                    sx={{ color: "#e0e0e0" }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={stat.percent}
                    size={44}
                    thickness={5}
                    sx={{
                      color: stat.color,
                      position: "absolute",
                      left: 0,
                    }}
                  />
                </Box>
              </Box>

              <Typography variant="h4" fontWeight={800} color={stat.color} mt={1}>
                {stat.value}
              </Typography>
              <Typography variant="caption" fontWeight={700} color={stat.color}>
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* ===== RECENT WORKFLOWS ===== */}
      <Card elevation={0} sx={{ border: `1px solid ${COLORS.lightBorder}`, borderRadius: 4 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6" fontWeight={800}>
              Recent Workflows
            </Typography>
            <Typography
              fontWeight={700}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              onClick={() => navigate("/admin/workflows")}
            >
              View all <ArrowForward sx={{ fontSize: 16, ml: 0.5 }} />
            </Typography>
          </Box>

          <List disablePadding>
            {paginated.map((w, i) => {
              let status = "pending";
              if (w.tasks?.some(t => t.status === "in-progress")) status = "in-progress";
              if (w.tasks?.length && w.tasks.every(t => t.status === "completed")) status = "completed";

              const chipColor =
                status === "completed" ? COLORS.green :
                status === "in-progress" ? COLORS.yellow :
                COLORS.red;

              return (
                <Box key={w._id}>
                  <ListItem>
                    <ListItemText
                      primary={<Typography fontWeight={700}>{w.title}</Typography>}
                      secondary={`${w.tasks?.length || 0} tasks`}
                    />
                    <Chip
                      label={status}
                      sx={{
                        bgcolor: chipColor,
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    />
                  </ListItem>
                  {i < paginated.length - 1 && <Divider />}
                </Box>
              );
            })}
          </List>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <Typography sx={{ mx: 2 }}>{page} / {totalPages}</Typography>
              <Button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
