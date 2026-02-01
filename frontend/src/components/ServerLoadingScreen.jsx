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
      <p>
        Meanwhile ui screenshots available in my github repo
        https://github.com/faizvk/promptive-ai.
      </p>
    </div>
  );
};

export default ServerLoadingScreen;
