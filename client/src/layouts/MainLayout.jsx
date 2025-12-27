import { Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Toolbar /> {/* spacer for fixed AppBar */}
      <Outlet />
    </>
  );
}
