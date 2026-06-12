import React from "react";

const LineProgressBar = ({ label, percentage, lineColor, amount }) => {
  return (
    <div style={{ marginBottom: "2px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{
            display: "inline-block", width: "8px", height: "8px",
            borderRadius: "50%", backgroundColor: lineColor, flexShrink: 0,
          }} />
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {amount !== undefined && (
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>₹{Number(amount).toLocaleString()}</span>
          )}
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: lineColor }}>{percentage}%</span>
        </div>
      </div>
      <div style={{
        height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden",
      }}>
        <div style={{
          width: `${percentage}%`,
          height: "100%",
          backgroundColor: lineColor,
          borderRadius: "3px",
          transition: "width 1s ease-in-out",
        }} />
      </div>
    </div>
  );
};

export default LineProgressBar;
