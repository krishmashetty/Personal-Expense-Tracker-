import React from "react";

const Spinner = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "40vh",
      gap: "16px",
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "3px solid rgba(99,102,241,0.15)",
        borderTop: "3px solid #6366f1",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }} />
      <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Loading...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Spinner;
