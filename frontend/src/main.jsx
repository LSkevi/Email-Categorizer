import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

// Debug info for deployment
console.log("Environment:", import.meta.env.MODE);
console.log("API URL:", import.meta.env.VITE_API_URL);
console.log("App starting...");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
