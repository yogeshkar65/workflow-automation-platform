import { useNavigate } from "react-router-dom";
import { setNavigate } from "./utils/navigation";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <AppRoutes />
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
