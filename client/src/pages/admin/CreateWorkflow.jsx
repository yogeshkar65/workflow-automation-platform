// import { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";

// const BLUE = "#1976d2";

// export default function CreateWorkflow() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     if (!title.trim()) return;

//     try {
//       setLoading(true);

//       await api.post("/workflows", {
//         title,
//         description
//       });

//       navigate("/admin/dashboard");
//     } catch (err) {
//       alert("Failed to create workflow");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
//       <Card elevation={0}>
//         <CardContent sx={{ p: 4 }}>
//           <Typography variant="h5" fontWeight={800} color={BLUE} mb={3}>
//             Create Workflow
//           </Typography>

//           <TextField
//             label="Workflow Title"
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

//           <Button
//             variant="contained"
//             fullWidth
//             onClick={handleSubmit}
//             disabled={loading}
//             sx={{ bgcolor: BLUE, fontWeight: 700 }}
//           >
//             {loading ? "Creating..." : "Create Workflow"}
//           </Button>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
import { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CreateWorkflow() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim()) return;

    await api.post("/workflows", { title, description });
    navigate("/admin/workflows");
  };

  return (
    <Box maxWidth={500} mx="auto" mt={4}>
      <Card>
        <CardContent>
          <Typography variant="h5">Create Workflow</Typography>

          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            sx={{ my: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleSubmit}>
            Create
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
