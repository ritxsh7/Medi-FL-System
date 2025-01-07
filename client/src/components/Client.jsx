import React, { useState } from "react";

const Client = () => {
  const [dataPath, setDataPath] = useState("");

  const selectData = async () => {
    const path = prompt("Enter dataset path:");
    setDataPath(path);
    await fetch("http://localhost:5001/select-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data_path: path }),
    });
    alert("Dataset selected!");
  };

  const joinServer = async () => {
    await fetch("http://localhost:5001/join-server", { method: "POST" });
    alert("Joined server!");
  };

  return (
    <div>
      <h1>Client Dashboard</h1>
      <button onClick={selectData}>Select Data</button>
      <button onClick={joinServer} disabled={!dataPath}>
        Join Training
      </button>
    </div>
  );
};

export default Client;
