// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // gửi cookie refreshToken
  headers: { "Content-Type": "application/json" },
});

// Dùng riêng cho gọi /auth/refresh để tránh vòng lặp interceptor
const axiosPlain = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

function getAccessToken() {
  return localStorage.getItem("token");
}

function setAccessToken(token) {
  if (!token) {
    localStorage.removeItem("token");
  } else {
    localStorage.setItem("token", token);
  }
}

// Gắn token vào mọi request
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let queue = [];

// Khi refresh xong thì xử lý lại mấy request pending
function processQueue(error, newToken = null) {
  queue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(newToken);
    }
  });
  queue = [];
}

// Auto refresh khi 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Nếu là lỗi khác 401 -> quăng ra luôn
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Không refresh cho mấy API auth
    if (
      original.url?.includes("/auth/login") ||
      original.url?.includes("/auth/refresh") ||
      original._retry
    ) {
      // Hết đường cứu -> đá về login
      setAccessToken(null);
      localStorage.removeItem("user");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    original._retry = true;

    // Nếu đã có 1 thằng đang refresh -> chờ nó
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      })
        .then((newToken) => {
          if (newToken) {
            original.headers.Authorization = `Bearer ${newToken}`;
          }
          return axiosClient(original);
        })
        .catch((err) => Promise.reject(err));
    }

    // Bắt đầu refresh mới
    isRefreshing = true;

    try {
      const res = await axiosPlain.post("/auth/refresh");
      const newToken = res.data.token;

      setAccessToken(newToken);
      axiosClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;

      processQueue(null, newToken);

      // Gắn token mới vào request cũ và bắn lại
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosClient(original);
    } catch (err) {
      processQueue(err, null);
      setAccessToken(null);
      localStorage.removeItem("user");
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;
