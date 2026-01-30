import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Skeleton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";

export default function CreateTask() {
  const { workflowId } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data || []);
      } catch {
        showError("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  /* ================= CREATE TASK ================= */
  const submit = async () => {
    if (!title.trim()) {
      showError("Task title is required");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/tasks", {
        title,
        assignedTo: assignedTo || null,
        workflow: workflowId,
      });

      showSuccess("Task created successfully");

      // Small delay so toast is visible
      setTimeout(() => {
        navigate(`/admin/workflows/${workflowId}`);
      }, 300);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* FULL PAGE LOADING OVERLAY */}
      <Backdrop
        open={submitting}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box textAlign="center">
          <CircularProgress color="inherit" />
          <Box mt={2} fontWeight={600}>
            Adding task...
          </Box>
        </Box>
      </Backdrop>

      <Box maxWidth={500} mx="auto" mt={4}>
        <Card>
          <CardContent>
            {/* TITLE */}
            {loadingUsers ? (
              <Skeleton height={56} sx={{ mb: 2 }} />
            ) : (
              <TextField
                fullWidth
                label="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}

            {/* ASSIGN USER */}
            {loadingUsers ? (
              <Skeleton height={56} sx={{ mb: 2 }} />
            ) : (
              <TextField
                select
                fullWidth
                label="Assign User"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                sx={{ mb: 2 }}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {users.map((u) => (
                  <MenuItem key={u._id} value={u._id}>
                    {u.name}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {/* BUTTON */}
            {loadingUsers ? (
              <Skeleton height={42} />
            ) : (
              <Button
                fullWidth
                variant="contained"
                onClick={submit}
                disabled={submitting}
              >
                Create Task
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
