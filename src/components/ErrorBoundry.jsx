import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI using MUI components
      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Something went wrong —{" "}
          <strong>
            please try again later or press <i>Ctrl+R</i> to reload
          </strong>
        </Alert>
      );
    }

    return this.props.children;
  }
}
