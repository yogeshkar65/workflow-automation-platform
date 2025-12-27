// import { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Chip,
//   Select,
//   MenuItem,
//   IconButton,
//   Divider,
//   CircularProgress,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../../services/api";

// /* ===== STATUS FLOW ===== */
// const STATUS_ORDER = ["pending", "in-progress", "completed"];

// /* ===== STATUS COLORS ===== */
// const STATUS_COLORS = {
//   pending: { bg: "#fdecea", color: "#d32f2f" },
//   "in-progress": { bg: "#fff8e1", color: "#f9a825" },
//   completed: { bg: "#e8f5e9", color: "#2e7d32" },
// };

// /* ===== PROGRESS ===== */
// const getProgress = (tasks = []) => {
//   if (!tasks.length) return 0;
//   const done = tasks.filter(t => t.status === "completed").length;
//   return Math.round((done / tasks.length) * 100);
// };

// const getProgressColor = (v) => {
//   if (v <= 20) return "#e36565";
//   if (v <= 40) return "#ddeb16";
//   if (v <= 60) return "#7865da";
//   if (v <= 90) return "#81c784";
//   return "#2e7d32";
// };

// export default function WorkflowDetails() {
//   const { workflowId } = useParams();
//   const navigate = useNavigate();

//   const [workflow, setWorkflow] = useState(null);
//   const [users, setUsers] = useState([]);

//   const loadWorkflow = async () => {
//     const res = await api.get(`/workflows/${workflowId}`);
//     setWorkflow(res.data);
//   };

//   useEffect(() => {
//     loadWorkflow();
//     api.get("/users").then(res => setUsers(res.data || []));
//   }, [workflowId]);

//   if (!workflow) return null;

//   const advanceStatus = async (task) => {
//     const idx = STATUS_ORDER.indexOf(task.status);
//     const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
//     await api.put(`/tasks/${task._id}/status`, { status: next });
//     loadWorkflow();
//   };

//   const assignUser = async (taskId, userId) => {
//     await api.put(`/tasks/${taskId}/assign`, { userId: userId || null });
//     loadWorkflow();
//   };

//   const deleteTask = async (taskId) => {
//     if (!window.confirm("Delete this task?")) return;
//     await api.delete(`/tasks/${taskId}`);
//     loadWorkflow();
//   };

//   const progress = getProgress(workflow.tasks);
//   const progressColor = getProgressColor(progress);

//   return (
//     <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
//       {/* BACK */}
//       <Button
//         startIcon={<ArrowBackIcon />}
//         sx={{ mb: 2 }}
//         onClick={() => navigate("/admin/workflows")}
//       >
//         Back to Workflows
//       </Button>

//       {/* HEADER */}
//       <Typography variant="h4" fontWeight={800}>
//         {workflow.title}
//       </Typography>

//       <Typography color="text.secondary" mb={3}>
//         {workflow.description}
//       </Typography>

//       {/* ===== DONUT (PERFECTLY CENTERED) ===== */}
//       <Box display="flex" alignItems="center" gap={4} mb={4}>
//         <Box
//           sx={{
//             position: "relative",
//             width: 120,
//             height: 120,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <CircularProgress
//             variant="determinate"
//             value={100}
//             size={120}
//             thickness={6}
//             sx={{
//               color: "#e0e0e0",
//               position: "absolute",
//             }}
//           />

//           <CircularProgress
//             variant="determinate"
//             value={progress}
//             size={120}
//             thickness={6}
//             sx={{
//               color: progressColor,
//               position: "absolute",
//             }}
//           />

//           <Typography
//             sx={{
//               position: "absolute",
//               fontWeight: 800,
//               fontSize: "1.1rem",
//               color: progressColor,
//             }}
//           >
//             {progress}%
//           </Typography>
//         </Box>

//         <Typography fontWeight={700}>
//           {workflow.tasks.filter(t => t.status === "completed").length} /{" "}
//           {workflow.tasks.length} tasks completed
//         </Typography>
//       </Box>

//       <Button
//         variant="contained"
//         sx={{ mb: 3 }}
//         onClick={() =>
//           navigate(`/admin/workflows/${workflowId}/createTask`)
//         }
//       >
//         + Add Task
//       </Button>

//       <Divider sx={{ mb: 3 }} />

//       {/* TASK LIST */}
//       {workflow.tasks.map((task, index) => {
//         const c = STATUS_COLORS[task.status];

//         return (
//           <Box
//             key={task._id}
//             sx={{
//               display: "grid",
//               gridTemplateColumns: "2fr 2fr 1fr auto",
//               gap: 2,
//               mb: 2,
//               p: 2,
//               border: "1px solid #e0e0e0",
//               borderRadius: 2,
//             }}
//           >
//             <Typography fontWeight={600}>
//               {index + 1}. {task.title}
//             </Typography>

//             <Select
//               size="small"
//               value={task.assignedTo?._id || ""}
//               displayEmpty
//               onChange={(e) =>
//                 assignUser(task._id, e.target.value || null)
//               }
//             >
//               <MenuItem value="">
//                 <em>Unassigned</em>
//               </MenuItem>
//               {users.map(u => (
//                 <MenuItem key={u._id} value={u._id}>
//                   {u.name}
//                 </MenuItem>
//               ))}
//             </Select>

//             <Chip
//               label={task.status.replace("-", " ")}
//               clickable
//               onClick={() => advanceStatus(task)}
//               sx={{
//                 bgcolor: c.bg,
//                 color: c.color,
//                 fontWeight: 700,
//                 textTransform: "capitalize",
//               }}
//             />

//             <IconButton color="error" onClick={() => deleteTask(task._id)}>
//               <DeleteIcon />
//             </IconButton>
//           </Box>
//         );
//       })}
//     </Box>
//   );
// }
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Select,
  MenuItem,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

/* ===== STATUS FLOW ===== */
const STATUS_ORDER = ["pending", "in-progress", "completed"];

/* ===== STATUS COLORS ===== */
const STATUS_COLORS = {
  pending: { bg: "#fdecea", color: "#d32f2f" },
  "in-progress": { bg: "#fff8e1", color: "#f9a825" },
  completed: { bg: "#e8f5e9", color: "#2e7d32" },
};

/* ===== PROGRESS ===== */
const getProgress = (tasks = []) => {
  if (!tasks.length) return 0;
  const done = tasks.filter(t => t.status === "completed").length;
  return Math.round((done / tasks.length) * 100);
};

const getProgressColor = (v) => {
  if (v <= 20) return "#e36565";
  if (v <= 40) return "#ddeb16";
  if (v <= 60) return "#7865da";
  if (v <= 90) return "#81c784";
  return "#2e7d32";
};

export default function WorkflowDetails() {
  const { workflowId } = useParams();
  const navigate = useNavigate();

  const [workflow, setWorkflow] = useState(null);
  const [users, setUsers] = useState([]);

  const loadWorkflow = async () => {
    const res = await api.get(`/workflows/${workflowId}`);
    setWorkflow(res.data);
  };

  useEffect(() => {
    loadWorkflow();
    api.get("/users").then(res => setUsers(res.data || []));
  }, [workflowId]);

  if (!workflow) return null;

  const advanceStatus = async (task) => {
    const idx = STATUS_ORDER.indexOf(task.status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    await api.put(`/tasks/${task._id}/status`, { status: next });
    loadWorkflow();
  };

  const assignUser = async (taskId, userId) => {
    await api.put(`/tasks/${taskId}/assign`, { userId: userId || null });
    loadWorkflow();
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${taskId}`);
    loadWorkflow();
  };

  const progress = getProgress(workflow.tasks);
  const progressColor = getProgressColor(progress);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      {/* ===== BACK ICON (TOP-LEFT CORNER) ===== */}
      <IconButton
        onClick={() => navigate("/admin/workflows")}
        sx={{
          mb: 1,
          ml: -1,
          color: "primary.main",
          "&:hover": {
            bgcolor: "rgba(25, 118, 210, 0.08)",
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* HEADER */}
      <Typography variant="h4" fontWeight={800}>
        {workflow.title}
      </Typography>

      <Typography color="text.secondary" mb={3}>
        {workflow.description}
      </Typography>

      {/* ===== DONUT ===== */}
      <Box display="flex" alignItems="center" gap={4} mb={4}>
        <Box
          sx={{
            position: "relative",
            width: 120,
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            variant="determinate"
            value={100}
            size={120}
            thickness={6}
            sx={{ color: "#e0e0e0", position: "absolute" }}
          />

          <CircularProgress
            variant="determinate"
            value={progress}
            size={120}
            thickness={6}
            sx={{ color: progressColor, position: "absolute" }}
          />

          <Typography
            sx={{
              position: "absolute",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: progressColor,
            }}
          >
            {progress}%
          </Typography>
        </Box>

        <Typography fontWeight={700}>
          {workflow.tasks.filter(t => t.status === "completed").length} /{" "}
          {workflow.tasks.length} tasks completed
        </Typography>
      </Box>

      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() =>
          navigate(`/admin/workflows/${workflowId}/createTask`)
        }
      >
        + Add Task
      </Button>

      <Divider sx={{ mb: 3 }} />

      {/* TASK LIST */}
      {workflow.tasks.map((task, index) => {
        const c = STATUS_COLORS[task.status];

        return (
          <Box
            key={task._id}
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 1fr auto",
              gap: 2,
              mb: 2,
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
            }}
          >
            <Typography fontWeight={600}>
              {index + 1}. {task.title}
            </Typography>

            <Select
              size="small"
              value={task.assignedTo?._id || ""}
              displayEmpty
              onChange={(e) =>
                assignUser(task._id, e.target.value || null)
              }
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {users.map(u => (
                <MenuItem key={u._id} value={u._id}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>

            <Chip
              label={task.status.replace("-", " ")}
              clickable
              onClick={() => advanceStatus(task)}
              sx={{
                bgcolor: c.bg,
                color: c.color,
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            />

            <IconButton color="error" onClick={() => deleteTask(task._id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })}
    </Box>
  );
}

