import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const message = this.state.error instanceof Error
        ? this.state.error.message
        : "An unexpected error occurred.";

      return <p role="alert" style={{ color: "red" }}>{message}</p>;
    }

    return this.props.children;
  }
}
