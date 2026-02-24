import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";

export default function CreateWorkflow() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [loadingDescription, setLoadingDescription] = useState(false);

  /* ================= GENERATE DESCRIPTION ================= */
  const handleGenerateDescription = async () => {
    if (!title.trim()) {
      showError("Enter workflow title first");
      return;
    }

    try {
      setLoadingDescription(true);

      const res = await api.post("/ai/generate-description", {
        title,
      });

      setDescription(res.data.description);
      showSuccess("AI description generated");

    } catch (err) {
      showError(err.response?.data?.message || "Failed to generate description");
    } finally {
      setLoadingDescription(false);
    }
  };

  /* ================= CREATE WORKFLOW ================= */
  const handleSubmit = async () => {
    if (!title.trim()) {
      showError("Workflow title is required");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/workflows", {
        title,
        description,
      });

      showSuccess("Workflow created successfully");

      setTimeout(() => {
        navigate("/admin/workflows");
      }, 300);

    } catch (err) {
      showError(err.response?.data?.message || "Failed to create workflow");
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ===== BACKDROP LOADER ===== */}
      <Backdrop
        open={submitting}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(255,255,255,0.6)",
        }}
      >
        <Box textAlign="center">
          <CircularProgress sx={{ color: "#1976d2" }} />
          <Typography mt={2} fontWeight={700} color="#1976d2">
            Creating workflow...
          </Typography>
        </Box>
      </Backdrop>

      <Box maxWidth={600} mx="auto" mt={4}>
        <Card>
          <CardContent>

            {/* ===== TITLE ===== */}
            <TextField
              fullWidth
              label="Workflow Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* ===== DESCRIPTION ===== */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Workflow Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* ===== AI GENERATE BUTTON ===== */}
            <Button
              variant="outlined"
              onClick={handleGenerateDescription}
              disabled={loadingDescription}
              sx={{ mb: 3 }}
            >
              {loadingDescription ? (
                <CircularProgress size={20} />
              ) : (
                "Generate Description"
              )}
            </Button>

            {/* ===== CREATE BUTTON ===== */}
            <Button
              fullWidth
              variant="contained"
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