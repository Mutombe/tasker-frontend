import axios from "axios";

// Create axios instance without store dependency
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/", 
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

// Separate token refresh logic
export const refreshTokens = async (refresh) => {
  try {
    const { data } = await axios.post("http://127.0.0.1:8000/core/auth/refresh/", { refresh });
    return data;
  } catch (error) {
    throw error;
  }
};

// Export a function to setup interceptors after store is created
export const setupInterceptors = (store, logoutAction) => {
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
          const data = await refreshTokens(refresh);
          localStorage.setItem("auth", JSON.stringify(data));
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(logoutAction());
          localStorage.removeItem("auth");
          window.location.href = "/login";
        }
      }
      
      return Promise.reject(error);
    }
  );
};

export default api;