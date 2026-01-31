import React from "react";

const ServerLoadingScreen = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <h2>Starting backend…</h2>
      <p>Render free tier sleeps after inactivity. Please wait.</p>
    </div>
  );
};

export default ServerLoadingScreen;
