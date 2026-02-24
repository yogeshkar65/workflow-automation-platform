import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../components/NavBar";
import AIChat from "../components/AIChat";  // ✅ add this

export default function UserLayout() {
  return (
    <>
      <Navbar />

      <Box sx={{ mt: 8 }}>
        <Outlet />
      </Box>

      <AIChat /> 
    </>
  );
}