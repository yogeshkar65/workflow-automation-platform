// const express = require("express");
// const router = express.Router();

// const { protect } = require("../middlewares/authMiddleware");
// const { adminOnly } = require("../middlewares/roleMiddleware");

// // ✅ FIXED FILE NAME (CASE MATTERS)
// const {
//   registerUser,
//   loginUser,
//   getProfile,
// } = require("../controllers/authController");

// /* ===== AUTH ===== */
// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/profile", protect, getProfile);

// /* ===== ADMIN TEST ===== */
// router.get("/admin_test", protect, adminOnly, (req, res) => {
//   res.status(200).json({ message: "Admin access granted" });
// });

// module.exports = router;
const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

router.get("/admin_test", protect, adminOnly, (req, res) => {
  res.json({ message: "Admin access granted" });
});

module.exports = router;
