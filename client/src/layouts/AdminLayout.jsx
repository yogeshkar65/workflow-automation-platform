import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import AIChat from "../components/AIChat"; 

const APPBAR_HEIGHT = 64;
const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
            boxSizing: "border-box",
            top: `${APPBAR_HEIGHT}px`,
            height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
            transition: "width .3s",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            px: 2,
            py: 1.5,
          }}
        >
          {!collapsed && (
            <Typography fontWeight={800} color="#1976d2">
              Admin
            </Typography>
          )}
          <IconButton size="small" onClick={() => setCollapsed(!collapsed)}>
            <MenuIcon />
          </IconButton>
        </Box>

        <List sx={{ px: 1 }}>
          {[
            { label: "Dashboard", path: "/admin" },
            { label: "Tasks", path: "/admin/tasks" },
            { label: "Workflows", path: "/admin/workflows" },
          ].map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 2,
                my: 0.5,
                "&.Mui-selected": {
                  bgcolor: "#e3f2fd",
                  color: "#1976d2",
                  fontWeight: 700,
                },
              }}
            >
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: `${APPBAR_HEIGHT}px`,
          px: 3,
        }}
      >
        <Outlet />
      </Box>

      <AIChat />
    </Box>
  );
}