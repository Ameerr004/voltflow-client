import { Component } from "react";

// Catches any render-time error in the tree and shows a friendly fallback
// instead of a blank white screen. Best-practice error handling for React.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("VoltFlow caught a render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <span className="material-symbols-outlined error-fallback-icon">error</span>
          <h1 className="headline-md">Something went wrong</h1>
          <p className="body-md text-muted">
            An unexpected error occurred. Please reload the page and try again.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.assign("/")}>
            Back to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
