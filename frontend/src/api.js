import axios from "axios";

// Create an instance of axios with the base URL
const API_URL = "https://email-categorizer.onrender.com";

console.log("API URL:", API_URL); // Debug log

const api = axios.create({
  baseURL: API_URL,
});

// Export the Axios instance
export default api;
