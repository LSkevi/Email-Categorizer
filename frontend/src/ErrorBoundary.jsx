import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fee",
            color: "#c00",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
          }}
        >
          <h2>Something went wrong!</h2>
          <details>
            <summary>Error details</summary>
            <p>{this.state.error?.toString()}</p>
            <p>API URL: {import.meta.env.VITE_API_URL || "Not set"}</p>
            <p>Environment: {import.meta.env.MODE}</p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
