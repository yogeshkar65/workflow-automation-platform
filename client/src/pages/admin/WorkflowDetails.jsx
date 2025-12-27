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

// /* =========================
//    STATUS ORDER
// ========================= */
// const STATUS_ORDER = ["pending", "in-progress", "completed"];

// /* =========================
//    PROGRESS HELPERS
// ========================= */
// const getProgress = (tasks = []) => {
//   if (tasks.length === 0) return 0;
//   const completed = tasks.filter((t) => t.status === "completed").length;
//   return Math.round((completed / tasks.length) * 100);
// };

// /* COLOR RULES YOU ASKED */
// const getProgressColor = (value) => {
//   if (value < 20) return "#d32f2f";       // red
//   if (value <= 40) return "#fb8c00";      // orange
//   if (value <= 60) return "#f9a825";      // yellow
//   if (value <= 90) return "#81c784";      // light green
//   return "#2e7d32";                       // dark green
// };


// export default function WorkflowDetails() {
//   const { workflowId } = useParams();
//   const navigate = useNavigate();

//   const [workflow, setWorkflow] = useState(null);
//   const [users, setUsers] = useState([]);

//   /* =========================
//      LOAD DATA
//   ========================= */
//   const loadWorkflow = async () => {
//     const res = await api.get(`/workflows/${workflowId}`);
//     setWorkflow(res.data);
//   };

//   useEffect(() => {
//     loadWorkflow();
//     api.get("/users").then((res) => setUsers(res.data || []));
//   }, [workflowId]);

//   if (!workflow) return null;

//   /* =========================
//      TASK ACTIONS
//   ========================= */
//   const advanceStatus = async (task) => {
//     const idx = STATUS_ORDER.indexOf(task.status);
//     const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
//     await api.put(`/tasks/${task._id}/status`, { status: next });
//     loadWorkflow();
//   };

//   const assignUser = async (taskId, userId) => {
//     await api.post(`/tasks/${taskId}/assign`, {
//       userId: userId || null,
//     });
//     loadWorkflow();
//   };

//   const deleteTask = async (taskId) => {
//     if (!window.confirm("Delete this task?")) return;
//     await api.delete(`/tasks/${taskId}`);
//     loadWorkflow();
//   };

//   /* =========================
//      PROGRESS
//   ========================= */
//   const progress = getProgress(workflow.tasks);
//   const progressColor = getProgressColor(progress);

//   /* =========================
//      UI
//   ========================= */
//   return (
//     <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
//       {/* BACK BUTTON */}
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

//       {/* DONUT PROGRESS */}
//       <Box display="flex" alignItems="center" gap={4} mb={4}>
//         <Box position="relative" display="inline-flex">
//           <CircularProgress
//             variant="determinate"
//             value={100}
//             size={140}
//             thickness={6}
//             sx={{ color: "#e0e0e0" }}
//           />
//           <CircularProgress
//             variant="determinate"
//             value={progress}
//             size={140}
//             thickness={6}
//             sx={{
//               color: progressColor,
//               position: "absolute",
//               left: 0,
//             }}
//           />
//           <Box
//             position="absolute"
//             top={0}
//             left={0}
//             right={0}
//             bottom={0}
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//           >
//             <Typography variant="h5" fontWeight={800} color={progressColor}>
//               {progress}%
//             </Typography>
//           </Box>
//         </Box>

//         <Box>
//           <Typography fontWeight={700}>
//             {workflow.tasks.filter((t) => t.status === "completed").length} /{" "}
//             {workflow.tasks.length} tasks completed
//           </Typography>
//           <Typography variant="caption" color="text.secondary">
//             Workflow progress
//           </Typography>
//         </Box>
//       </Box>

//       {/* ADD TASK */}
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
//       {workflow.tasks.length === 0 ? (
//         <Typography color="text.secondary">
//           No tasks in this workflow
//         </Typography>
//       ) : (
//         workflow.tasks.map((task, index) => (
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

//             {/* ASSIGN USER */}
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
//               {users.map((u) => (
//                 <MenuItem key={u._id} value={u._id}>
//                   {u.name}
//                 </MenuItem>
//               ))}
//             </Select>

//             {/* STATUS */}
//             <Chip
//               label={task.status}
//               clickable
//               color={
//                 task.status === "completed"
//                   ? "success"
//                   : task.status === "in-progress"
//                   ? "warning"
//                   : "default"
//               }
//               onClick={() => advanceStatus(task)}
//             />

//             {/* DELETE */}
//             <IconButton
//               color="error"
//               onClick={() => deleteTask(task._id)}
//             >
//               <DeleteIcon />
//             </IconButton>
//           </Box>
//         ))
//       )}
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

/* ===== STATUS FLOW (ADMIN CAN LOOP) ===== */
const STATUS_ORDER = ["pending", "in-progress", "completed"];

/* ===== STATUS COLORS ===== */
const STATUS_COLORS = {
  pending: {
    bg: "#fdecea",
    color: "#d32f2f",
  },
  "in-progress": {
    bg: "#fff8e1",
    color: "#f9a825",
  },
  completed: {
    bg: "#e8f5e9",
    color: "#2e7d32",
  },
};

/* ===== PROGRESS ===== */
const getProgress = (tasks = []) => {
  if (!tasks.length) return 0;
  const done = tasks.filter(t => t.status === "completed").length;
  return Math.round((done / tasks.length) * 100);
};

const getProgressColor = (v) => {
  if (v < 20) return "#d32f2f";
  if (v <= 40) return "#fb8c00";
  if (v <= 60) return "#f9a825";
  if (v <= 90) return "#81c784";
  return "#2e7d32";
};

export default function WorkflowDetails() {
  const { workflowId } = useParams();
  const navigate = useNavigate();

  const [workflow, setWorkflow] = useState(null);
  const [users, setUsers] = useState([]);

  /* ===== LOAD DATA ===== */
  const loadWorkflow = async () => {
    const res = await api.get(`/workflows/${workflowId}`);
    setWorkflow(res.data);
  };

  useEffect(() => {
    loadWorkflow();
    api.get("/users").then(res => setUsers(res.data || []));
  }, [workflowId]);

  if (!workflow) return null;

  /* ===== STATUS CHANGE (CYCLIC) ===== */
  const advanceStatus = async (task) => {
    const idx = STATUS_ORDER.indexOf(task.status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];

    await api.put(`/tasks/${task._id}/status`, { status: next });
    loadWorkflow();
  };

  /* ===== ASSIGN USER ===== */
  const assignUser = async (taskId, userId) => {
    await api.put(`/tasks/${taskId}/assign`, {
      userId: userId || null,
    });
    loadWorkflow();
  };

  /* ===== DELETE TASK ===== */
  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${taskId}`);
    loadWorkflow();
  };

  const progress = getProgress(workflow.tasks);
  const progressColor = getProgressColor(progress);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      {/* BACK */}
      <Button
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        onClick={() => navigate("/admin/workflows")}
      >
        Back to Workflows
      </Button>

      {/* HEADER */}
      <Typography variant="h4" fontWeight={800}>
        {workflow.title}
      </Typography>

      <Typography color="text.secondary" mb={3}>
        {workflow.description}
      </Typography>

      {/* DONUT */}
      <Box display="flex" alignItems="center" gap={4} mb={4}>
        <Box position="relative">
          <CircularProgress
            variant="determinate"
            value={100}
            size={120}
            thickness={6}
            sx={{ color: "#e0e0e0" }}
          />
          <CircularProgress
            variant="determinate"
            value={progress}
            size={120}
            thickness={6}
            sx={{
              color: progressColor,
              position: "absolute",
              left: 0,
              top: 0,
            }}
          />
          <Box
            position="absolute"
            inset={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography fontWeight={800} color={progressColor}>
              {progress}%
            </Typography>
          </Box>
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

            {/* ASSIGN */}
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

            {/* STATUS */}
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

            {/* DELETE */}
            <IconButton color="error" onClick={() => deleteTask(task._id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })}
    </Box>
  );
}
