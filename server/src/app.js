const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const authRoutes = require("./routes/authRoutes");
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.get("/",(req,res)=>{
  res.send("API is running...");
});
module.exports = app;



