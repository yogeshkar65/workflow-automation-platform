// // // const express = require("express");
// // // const router = express.Router();

// // // const {
// // //   createTask,
// // //   getTasks,
// // //   getTaskById,
// // //   assignTask,
// // //   updateTaskStatus,
// // //   deleteTask,
// // // } = require("../controllers/taskController");

// // // const { protect } = require("../middlewares/authMiddleware");
// // // const { adminOnly } = require("../middlewares/roleMiddleware");

// // // router.get("/", protect, getTasks);
// // // router.post("/", protect, adminOnly, createTask);
// // // router.get("/:id", protect, getTaskById);
// // // router.post("/:id/assign", protect, adminOnly, assignTask);
// // // router.put("/:id/status", protect, updateTaskStatus);
// // // router.delete("/:id", protect, adminOnly, deleteTask);

// // // module.exports = router;
// // const express = require("express");
// // const router = express.Router();

// // const {
// //   createTask,
// //   getTasks,
// //   updateTaskStatus,
// //   assignTask,
// //   deleteTask,
// // } = require("../controllers/taskController");

// // const auth = require("../middleware/auth");
// // const { adminOnly } = require("../middleware/adminOnly");

// // /* ===== USER ===== */
// // router.get("/", auth, getTasks);
// // router.put("/:id/status", auth, updateTaskStatus);

// // /* ===== ADMIN ===== */
// // router.post("/", auth, adminOnly, createTask);
// // router.put("/:id/assign", auth, adminOnly, assignTask);
// // router.delete("/:id", auth, adminOnly, deleteTask);

// // module.exports = router;

// const express = require("express");
// const router = express.Router();

// const {
//   createTask,
//   getTasks,
//   updateTaskStatus,
//   assignTask,
//   deleteTask,
// } = require("../controllers/taskController");

// const auth = require("../middleware/auth");
// const { adminOnly } = require("../middleware/adminOnly");

// /* ===== USER ===== */
// router.get("/", auth, getTasks);
// router.put("/:id/status", auth, updateTaskStatus);

// /* ===== ADMIN ===== */
// router.post("/", auth, adminOnly, createTask);
// router.put("/:id/assign", auth, adminOnly, assignTask);
// router.delete("/:id", auth, adminOnly, deleteTask);

// module.exports = router;
const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTaskStatus,
  assignTask,
  deleteTask,
} = require("../controllers/taskController");

// ✅ FIXED PATHS (THIS WAS THE CRASH)
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

/* ===== USER ===== */
router.get("/", protect, getTasks);
router.put("/:id/status", protect, updateTaskStatus);

/* ===== ADMIN ===== */
router.post("/", protect, adminOnly, createTask);
router.put("/:id/assign", protect, adminOnly, assignTask);
router.delete("/:id", protect, adminOnly, deleteTask);

module.exports = router;
