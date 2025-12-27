import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function WorkflowCard({ workflow }) {
  const navigate = useNavigate();

  const totalTasks = workflow.tasks.length;
  const completedTasks = workflow.tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const currentStep =
    workflow.tasks.find((task) => task.status !== "completed") || null;

  const handleClick = () => {
    navigate(`/admin/workflows/${workflow._id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        mb: 3,
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6">{workflow.title}</Typography>

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {workflow.description}
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress variant="determinate" value={progress} />
          <Typography>{progress}% Complete</Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="body2">
            Current Step:{" "}
            {currentStep ? currentStep.title : "All tasks completed"}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          color="primary"
          sx={{ mt: 1, display: "inline-block" }}
        >
          View workflow →
        </Typography>
      </CardContent>
    </Card>
  );
}

export default WorkflowCard;
