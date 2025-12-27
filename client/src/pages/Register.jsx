// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   IconButton,
//   InputAdornment,
//   Alert,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";

// export default function Register() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       setLoading(true);
//       const res = await api.post("/auth/register", { name, email, password });

//       const { _id, role, token } = res.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify({ _id, name, email, role }));

//       navigate(role === "admin" ? "/admin" : "/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ background: "#f5f7fb" }}>
//       <Paper sx={{ p: 4, width: 380, borderRadius: 3 }}>
//         <Typography variant="h5" fontWeight={800}>Create Account</Typography>
//         <Typography color="text.secondary" mb={3}>Sign up to get started</Typography>

//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//         <form onSubmit={handleRegister}>
//           <TextField label="Full Name" fullWidth required margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
//           <TextField label="Email" fullWidth required margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />

//           <TextField
//             label="Password"
//             type={showPassword ? "text" : "password"}
//             fullWidth
//             required
//             margin="normal"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={() => setShowPassword(p => !p)}>
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Button fullWidth variant="contained" disabled={loading} sx={{ mt: 3 }}>
//             {loading ? "Creating..." : "Create Account"}
//           </Button>
//         </form>

//         <Typography align="center" mt={3}>
//           Already have an account?{" "}
//           <span style={{ color: "#1976d2", cursor: "pointer" }} onClick={() => navigate("/login")}>
//             Login
//           </span>
//         </Typography>
//       </Paper>
//     </Box>
//   );
// }
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const { _id, role, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ _id, name, email, role })
      );

      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="calc(100vh - 64px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: "#f5f7fb" }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 380, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={800} mb={1}>
          Create Account
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Sign up to get started
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleRegister}>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} /> : "Create Account"}
          </Button>
        </form>

        <Typography align="center" mt={3} fontSize={14}>
          Already have an account?{" "}
          <Typography
            component="span"
            color="primary"
            sx={{ cursor: "pointer", fontWeight: 600 }}
            onClick={() => navigate("/login")}
          >
            Login
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
}
