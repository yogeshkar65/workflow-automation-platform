import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import WorkflowLogo from "./WorkflowLogo";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const goDashboard = () => {
    if (!token || !user) {
      navigate("/login");
      return;
    }
    navigate(user.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <AppBar position="fixed" elevation={1}>
      <Toolbar
        sx={{
          height: 64,
          px: { xs: 2, md: 4 },
          display: "flex",
        }}
      >
        {/* LOGO + TITLE — hard left */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",

            /* subtle professional animation */
            "& svg": {
              transition: "transform 0.35s ease",
            },
            "&:hover svg": {
              transform: "rotate(90deg)",
            },
          }}
        >
          <WorkflowLogo size={22} />

          <Typography
            sx={{
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.95rem",
              letterSpacing: "0.4px",
              lineHeight: 1,
            }}
          >
            Workflow Automation
          </Typography>
        </Box>

        {/* PUSH NAV TO RIGHT */}
        <Box sx={{ flexGrow: 1 }} />

        {/* NAV — hard right */}
        <Box display="flex" alignItems="center" gap={1}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          {!token ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={goDashboard}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
