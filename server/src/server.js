require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

/* =====================================================
   CREATE HTTP SERVER
===================================================== */
const server = http.createServer(app);

/* =====================================================
   CREATE SOCKET.IO SERVER
===================================================== */
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://chic-kulfi-9ff415.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

/* =====================================================
   ONLINE USER TRACKING (DEBUG + SAFE VERSION)
===================================================== */

const onlineUsers = new Map(); // userId(string) -> socketId

io.on("connection", (socket) => {
  console.log("🔥 SERVER: socket connected:", socket.id);

  // When frontend emits userOnline
  socket.on("userOnline", (userId) => {
    console.log("📩 SERVER: userOnline received:", userId);

    if (!userId) return;

    const id = userId.toString(); // ensure string consistency
    onlineUsers.set(id, socket.id);

    console.log("🟢 CURRENT ONLINE USERS MAP:", onlineUsers);

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  // On disconnect
  socket.on("disconnect", (reason) => {
    console.log("❌ SERVER: socket disconnected:", socket.id, reason);

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    console.log("🟡 ONLINE USERS AFTER DISCONNECT:", onlineUsers);

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

/* =====================================================
   MAKE IO AVAILABLE IN CONTROLLERS
===================================================== */
app.set("io", io);
app.set("onlineUsers", onlineUsers);

/* =====================================================
   START SERVER
===================================================== */
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });

// require("dotenv").config();

// const app = require("./app");
// const connectDB = require("./config/db");

// const http = require("http");
// const { Server } = require("socket.io");

// const PORT = process.env.PORT || 5000;

// // Create HTTP server
// const server = http.createServer(app);

// // Create Socket.io server
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:3000",
//       "https://chic-kulfi-9ff415.netlify.app"
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
//   }
// });

// /* =====================================================
//    🟢 ONLINE USER TRACKING (Production-Level Version)
// ===================================================== */

// const onlineUsers = new Map(); 
// // userId -> socketId

// io.on("connection", (socket) => {

//   // User comes online
//   socket.on("userOnline", (userId) => {
//     if (!userId) return;

//     onlineUsers.set(userId, socket.id);

//     // Broadcast updated online users list
//     io.emit("onlineUsers", Array.from(onlineUsers.keys()));
//   });

//   // User disconnects
//   socket.on("disconnect", () => {
//     for (let [userId, socketId] of onlineUsers.entries()) {
//       if (socketId === socket.id) {
//         onlineUsers.delete(userId);
//         break;
//       }
//     }

//     // Broadcast updated list
//     io.emit("onlineUsers", Array.from(onlineUsers.keys()));
//   });
// });

// /* =====================================================
//    Make io accessible inside controllers
// ===================================================== */

// app.set("io", io);

// // Also expose onlineUsers map to controllers
// app.set("onlineUsers", onlineUsers);

// /* =====================================================
//    Start Server
// ===================================================== */

// connectDB()
//   .then(() => {
//     server.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("DB connection failed", err);
//     process.exit(1);
//   });