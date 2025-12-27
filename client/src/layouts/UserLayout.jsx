import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar"; // your top navbar

export default function UserLayout() {
  return (
    <>
      <Navbar />
      <Box sx={{ mt: 8 }}>
        <Outlet />
      </Box>
    </>
  );
}
