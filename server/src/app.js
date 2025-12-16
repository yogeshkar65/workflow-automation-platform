const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require(path.join(__dirname, "routes", "taskRoutes"));
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
// app.use("/api/tasks", (req, res, next) => {
//   console.log("/api/tasks middleware hit");
//   next();
// });
app.use("/api/tasks",taskRoutes);
app.get("/",(req,res)=>{
  res.send("API is running...");
});
module.exports = app;



