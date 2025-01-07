import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const Admin = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const socket = socketIOClient("http://localhost:5000");
    socket.on("update_metrics", (metric) => {
      setMetrics((prev) => [...prev, metric]);
    });
    return () => socket.disconnect();
  }, []);

  const startServer = async () => {
    await fetch("http://localhost:5000/start-server", { method: "POST" });
    alert("Server started!");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={startServer}>Start Server</button>
      <h2>Metrics</h2>
      <ul>
        {metrics.map((m, index) => (
          <li key={index}>{JSON.stringify(m)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
