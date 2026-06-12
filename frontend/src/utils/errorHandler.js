/**
 * Parses axios errors into human-readable messages.
 */
export const getErrorMessage = (err) => {
  if (!err.response) {
    // No response at all — network/server down
    if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
      return "Cannot connect to server. Make sure the backend is running on port 5000.";
    }
    if (err.code === "ECONNREFUSED") {
      return "Connection refused. Start the backend server and try again.";
    }
    return `Network error: ${err.message}`;
  }

  const status = err.response.status;
  const serverMsg = err.response?.data?.message;

  switch (status) {
    case 400:
      return serverMsg || "Invalid request. Please check your input.";
    case 401:
      return serverMsg || "Incorrect email or password.";
    case 403:
      return serverMsg || "You don't have permission to do that.";
    case 404:
      return serverMsg || "Resource not found.";
    case 409:
      return serverMsg || "An account with this email already exists.";
    case 422:
      return serverMsg || "Validation failed. Please check your input.";
    case 500:
      return serverMsg || "Server error. Please try again later.";
    default:
      return serverMsg || `Unexpected error (${status}). Please try again.`;
  }
};
