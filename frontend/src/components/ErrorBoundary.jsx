import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg-soft">
        <div className="max-w-md w-full bg-white rounded-2xl border border-border-soft p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-bg-error text-text-error flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
          <h1 className="text-xl font-extrabold text-text-primary mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            An unexpected error occurred while rendering this page. Try
            reloading — if it persists, please report it.
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-[#032c5a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <RefreshCw size={15} /> Reload
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
