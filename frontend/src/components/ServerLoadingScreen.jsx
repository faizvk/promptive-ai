import React from "react";

const ServerLoadingScreen = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-2.5">
      <h2>Starting backend…</h2>
      <p>Render free tier sleeps after inactivity. Please wait.</p>
      <p>
        Meanwhile ui screenshots available in my github repo
        <a href="https://github.com/faizvk/promptive-ai" target="_blank">
          https://github.com/faizvk/promptive-ai
        </a>
      </p>
    </div>
  );
};

export default ServerLoadingScreen;
