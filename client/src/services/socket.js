import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"]
});

export default socket;


// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   withCredentials: true,
//   transports: ["websocket"],
//   autoConnect: true
// });

// socket.on("connect", () => {
//   console.log("✅ SOCKET CONNECTED:", socket.id);
// });

// socket.on("disconnect", () => {
//   console.log("❌ SOCKET DISCONNECTED");
// });

// socket.on("connect_error", (err) => {
//   console.log("❌ SOCKET ERROR:", err.message);
// });

// export default socket;


// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   withCredentials: true,
//   transports: ["websocket"]
// });

// export default socket;