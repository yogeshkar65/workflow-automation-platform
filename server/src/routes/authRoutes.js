const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
const {
  registerUser,
  loginUser
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/admin_test", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin access granted" });
});

module.exports = router;
