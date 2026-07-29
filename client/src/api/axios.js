import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Request interceptor to automatically attach token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;