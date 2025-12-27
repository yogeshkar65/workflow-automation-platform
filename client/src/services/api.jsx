// import axios from "axios";

// /*
//   IMPORTANT RULES
//   ----------------
//   1. Token is read ONLY from localStorage
//   2. We DO NOT auto-logout on every 401
//   3. We logout ONLY when AUTH routes fail
// */

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /* ===============================
//    REQUEST INTERCEPTOR
//    =============================== */
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /* ===============================
//    RESPONSE INTERCEPTOR
//    =============================== */
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;
//     const url = error.config?.url || "";

//     console.error("API ERROR:", status, url);

//     /*
//       ONLY logout if AUTH endpoints fail
//       (login / profile / register)
//     */
//     if (
//       status === 401 &&
//       (url.includes("/auth/login") ||
//        url.includes("/auth/profile") ||
//        url.includes("/auth/register"))
//     ) {
//       console.warn("Auth failed → logging out");

//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if needed
});

/* ===== REQUEST INTERCEPTOR ===== */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ===== RESPONSE INTERCEPTOR ===== */
/* ❌ DO NOT AUTO REDIRECT ON 401 */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
