const express = require("express");
const router = express.Router();
const {protect} = require("../middlewares/authMiddleware");
const { registerUser, loginUser, getProfile } = require("../controllers/authController");
const { adminOnly } = require("../middlewares/roleMiddleware");
router.post("/register",registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get("/admin_test",protect,adminOnly,(req,res)=>{
 res.status(200).json({message :"Admin access granted"});
});
module.exports = router; 