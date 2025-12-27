const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require(path.join(__dirname, "routes", "taskRoutes"));
const workflowRoutes = require("./routes/workflowRoutes");
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/workflows", workflowRoutes);
app.get("/",(req,res)=>{
  res.send("API is running...");
});
module.exports = app;



