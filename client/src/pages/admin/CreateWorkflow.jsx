import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";

export default function CreateWorkflow() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim()) {
      showError("Workflow title is required");
      return;
    }

    if (submitting) return; // hard guard

    try {
      setSubmitting(true);

      await api.post("/workflows", {
        title,
        description,
      });

      showSuccess("Workflow created successfully");
      navigate("/admin/workflows");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create workflow");
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* GLOBAL LOADER */}
      <Backdrop
        open={submitting}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0,0,0,0.35)",
        }}
      >
        <Box textAlign="center">
          <CircularProgress sx={{ color: "#1976d2" }} />
          <Typography mt={2} fontWeight={600} color="#fff">
            Creating workflow...
          </Typography>
        </Box>
      </Backdrop>

      <Box maxWidth={500} mx="auto" mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" fontWeight={700} mb={2}>
              Create Workflow
            </Typography>

            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
              disabled={submitting}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={submitting}
              onClick={handleSubmit}
            >
              Create Workflow
            </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
