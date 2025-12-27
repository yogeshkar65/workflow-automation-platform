import { useEffect, useState } from "react";
import { Table, TableRow, TableCell, Button, Chip } from "@mui/material";
import { useLocation } from "react-router-dom";
import api from "../../services/api";

function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const location = useLocation();

  const statusFilter = new URLSearchParams(location.search).get("status");

  useEffect(() => {
    api.get("/tasks").then(res => setTasks(res.data || []));
  }, []);

  const filteredTasks = statusFilter
    ? tasks.filter(t => t.status === statusFilter)
    : tasks;

  const deleteTask = async (id) => {
    if (!window.confirm("Delete task?")) return;
    await api.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  return (
    <Table>
      {filteredTasks.map(task => (
        <TableRow key={task._id}>
          <TableCell>{task.title}</TableCell>
          <TableCell>
            <Chip label={task.status} />
          </TableCell>
          <TableCell>
            {task.assignedTo?.name || "Unassigned"}
          </TableCell>
          <TableCell>
            <Button color="error" onClick={() => deleteTask(task._id)}>
              Delete
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

export default AdminTasks;
