import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:5000");

const LogViewer = () => {
  const [serverLogs, setServerLogs] = useState("");
  const [clientLogs, setClientLogs] = useState({});

  useEffect(() => {
    // Listen for server logs
    socket.on("server_log", (data) => {
      setServerLogs((prev) => prev + data.log);
    });

    // Listen for client logs
    for (let clientId = 1; clientId <= 2; clientId++) {
      socket.on(`client_${clientId}_log`, (data) => {
        setClientLogs((prev) => ({
          ...prev,
          [clientId]: (prev[clientId] || "") + data.log,
        }));
      });
    }

    return () => {
      socket.off("server_log");
      for (let clientId = 1; clientId <= 2; clientId++) {
        socket.off(`client_${clientId}_log`);
      }
    };
  }, []);

  return (
    <div>
      <h2>Server Logs</h2>
      <pre>{serverLogs}</pre>
      <h2>Client Logs</h2>
      {Object.keys(clientLogs).map((clientId) => (
        <div key={clientId}>
          <h3>Client {clientId}</h3>
          <pre>{clientLogs[clientId]}</pre>
        </div>
      ))}
    </div>
  );
};

export default LogViewer;
