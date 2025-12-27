// import { useEffect, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   MenuItem,
// } from "@mui/material";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../../services/api";

// const BLUE = "#1976d2";

// export default function CreateTask() {
//   const { workflowId } = useParams(); // 👈 workflow this task belongs to
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [assignedTo, setAssignedTo] = useState("");
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* ================= FETCH USERS ================= */
//   useEffect(() => {
//     api
//       .get("/users")
//       .then((res) => setUsers(res.data || []))
//       .catch(() => setUsers([]));
//   }, []);

//   /* ================= CREATE TASK ================= */
//   const handleSubmit = async () => {
//     if (!title.trim()) {
//       alert("Task title is required");
//       return;
//     }

//     try {
//       setLoading(true);

//       await api.post("/tasks", {
//         title,
//         description,
//         assignedTo: assignedTo || null,
//         workflow: workflowId, // 🔥 VERY IMPORTANT
//       });

//       // Redirect back to workflow details
//       navigate(`/admin/workflows/${workflowId}`);
//     } catch (error) {
//       alert("Failed to create task");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 520, mx: "auto", mt: 4 }}>
//       <Card elevation={0}>
//         <CardContent sx={{ p: 4 }}>
//           <Typography variant="h5" fontWeight={800} color={BLUE} mb={3}>
//             Create Task
//           </Typography>

//           <TextField
//             label="Task Title"
//             fullWidth
//             required
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             sx={{ mb: 3 }}
//           />

//           <TextField
//             label="Description"
//             fullWidth
//             multiline
//             rows={3}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             sx={{ mb: 3 }}
//           />

//           <TextField
//             select
//             label="Assign To (optional)"
//             fullWidth
//             value={assignedTo}
//             onChange={(e) => setAssignedTo(e.target.value)}
//             sx={{ mb: 3 }}
//           >
//             <MenuItem value="">Unassigned</MenuItem>
//             {users.map((user) => (
//               <MenuItem key={user._id} value={user._id}>
//                 {user.name} ({user.email})
//               </MenuItem>
//             ))}
//           </TextField>

//           <Button
//             variant="contained"
//             fullWidth
//             disabled={loading}
//             onClick={handleSubmit}
//             sx={{
//               bgcolor: BLUE,
//               fontWeight: 700,
//               py: 1.2,
//             }}
//           >
//             {loading ? "Creating..." : "Create Task"}
//           </Button>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, TextField, Button, MenuItem
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function CreateTask() {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    api.get("/users").then(res => setUsers(res.data));
  }, []);

  const submit = async () => {
    await api.post("/tasks", {
      title,
      assignedTo: assignedTo || null,
      workflow: workflowId
    });
    navigate(`/admin/workflows/${workflowId}`);
  };

  return (
    <Box maxWidth={500} mx="auto" mt={4}>
      <Card>
        <CardContent>
          <TextField
            fullWidth
            label="Task Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            select
            fullWidth
            label="Assign User"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {users.map(u => (
              <MenuItem key={u._id} value={u._id}>
                {u.name}
              </MenuItem>
            ))}
          </TextField>

          <Button fullWidth variant="contained" onClick={submit}>
            Create Task
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
