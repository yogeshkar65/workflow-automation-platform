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
