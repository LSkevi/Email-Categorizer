import axios from "axios";

// Use environment variable or fallback to Render URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://email-categorizer.onrender.com";

console.log("🔗 Connecting to API:", API_BASE_URL);

// Create an instance of axios with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Export the Axios instance
export default api; 
