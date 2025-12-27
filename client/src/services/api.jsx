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
