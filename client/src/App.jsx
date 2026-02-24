import { useEffect } from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "./services/socket";

function App() {

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log("🔌 Socket connected from App");
    }
  }, []);

  return (
    <>
      <Navbar />
      <AppRoutes />
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;