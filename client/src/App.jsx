import { useNavigate } from "react-router-dom";
import { setNavigate } from "./utils/navigation";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
function App() {
      const navigate = useNavigate();
      useEffect(()=>{
        setNavigate(navigate);
      },[navigate]);


  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
}
export default App;