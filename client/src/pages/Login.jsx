import { useState } from "react";
import api from "../services/api";
import {
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { _id, name, role, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ _id, name, email, role })
      );

      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password"
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
      <Paper elevation={4} sx={{ width: 360, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={800} mb={1}>
          Welcome Back
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Login to continue
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
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
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 2, py: 1.2, fontWeight: 700 }}
          >
            {loading ? <CircularProgress size={22} /> : "Login"}
          </Button>
        </form>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2">
            Don’t have an account?{" "}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Create Account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
