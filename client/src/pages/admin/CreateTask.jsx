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

export default function CreateTask() {
  const { workflowId } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ===== LOAD USERS ===== */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  /* ===== CREATE TASK ===== */
  const submit = async () => {
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await api.post("/tasks", {
        title,
        assignedTo: assignedTo || null,
        workflow: workflowId,
      });

      // redirect back to workflow (WorkflowDetails will refetch)
      navigate(`/admin/workflows/${workflowId}`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* LOADING OVERLAY WHILE CREATING TASK */}
      <Backdrop
        open={submitting}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box maxWidth={500} mx="auto" mt={4}>
        <Card>
          <CardContent>
            {/* TASK TITLE */}
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

            {/* CREATE BUTTON */}
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
