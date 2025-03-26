// src/utils/api.js
import axios from "axios";
import { store } from "../redux/store/store";
import { logout } from "../redux/slices/authSlice";

// Configure base axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

// Request interceptor
api.interceptors.request.use((config) => {
  const tokens = JSON.parse(localStorage.getItem("auth"));
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
});

// Response interceptor (handles token refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { refresh } = JSON.parse(localStorage.getItem("auth")) || {};
        if (!refresh) throw new Error("No refresh token");
        
        // Refresh tokens
        const { data } = await axios.post("/api/auth/refresh/", { refresh });
        localStorage.setItem("auth", JSON.stringify(data));
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        localStorage.removeItem("auth");
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;