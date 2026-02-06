const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "https://chic-kulfi-9ff415.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require(path.join(__dirname, "routes", "taskRoutes"));
const workflowRoutes = require("./routes/workflowRoutes");

app.use("/api/auth",authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/workflows", workflowRoutes);
app.get("/",(req,res)=>{
  res.send("API is running...");
});
module.exports = app;



