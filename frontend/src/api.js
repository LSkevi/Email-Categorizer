import axios from "axios";

// Create an instance of axios with the base URL
const api = axios.create({
  baseURL: "https://email-categorizer.onrender.com",
});

// Export the Axios instance
export default api;
