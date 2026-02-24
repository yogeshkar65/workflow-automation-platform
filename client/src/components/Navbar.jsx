import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Badge
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import socket from "../services/socket";
import WorkflowLogo from "./WorkflowLogo";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [notifications, setNotifications] = useState(0);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

 const goDashboard = () => {
  if (!token || !user) {
    navigate("/login");
    return;
  }

  if (user.role === "user") {
    setNotifications(0); // ✅ reset badge only for users
  }

  navigate(user.role === "admin" ? "/admin" : "/dashboard");
};

  /* =====================================================
     🟢 USER ONLINE EMIT + 🔔 NOTIFICATION LISTENER
  ===================================================== */
        useEffect(() => {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                const storedToken = localStorage.getItem("token");

                if (!storedUser || !storedToken) return;

                const userId = storedUser._id;

                const emitOnline = () => {
                    socket.emit("userOnline", userId);
                    console.log("📤 userOnline emitted");
                };

                if (socket.connected) {
                    emitOnline();
                } else {
                    socket.once("connect", emitOnline);
                }

                // 🔥 Prevent duplicate listeners
                socket.off("newTaskAssigned");

                socket.on("newTaskAssigned", (data) => {
                    setNotifications((prev) => prev + 1);
                    toast.info(data.message);
                });

                return () => {
                    socket.off("newTaskAssigned");
                };

            }, []);

  return (
    <AppBar position="fixed" elevation={1}>
      <Toolbar
        sx={{
          height: 64,
          px: { xs: 2, md: 4 },
          display: "flex",
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
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

        <Box sx={{ flexGrow: 1 }} />

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

              {/* 🔔 Notification Icon (Only for users) */}
              {user?.role === "user" && (
                <Badge
                  badgeContent={notifications}
                  color="error"
                  sx={{ mr: 1 }}
                >
                  <NotificationsIcon sx={{ color: "#fff" }} />
                </Badge>
              )}

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