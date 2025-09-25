// src/api/axiosInstance.js
import axios from "axios";


let baseURL = "";
if (process.env.REACT_APP_BACKEND_URL == '/api') {
  baseURL = process.env.REACT_APP_BACKEND_URL;
} else {
  baseURL = process.env.REACT_APP_BACKEND_URL + '/api';
}

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api", 
  // baseURL: "https://elearning-be-water.onrender.com/api",
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động gắn token vào header của mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Flag để tránh vòng lặp vô hạn nếu refresh liên tục lỗi
let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu token hết hạn và chưa từng thử refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Tránh gọi nhiều refresh cùng lúc
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const res = await axios.post(
            baseURL + "/auth/refresh-token",
            { refreshToken }
          );

          const newAccessToken = res.data.accessToken;
          localStorage.setItem("token", newAccessToken);
          axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          isRefreshing = false;

          console.log("I get access Token again bro") ;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
