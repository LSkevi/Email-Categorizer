import axios from "axios";

// Use environment variable or fallback to production URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://email-categorizer.onrender.com";

// Create axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
});

export default api;
