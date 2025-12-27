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
