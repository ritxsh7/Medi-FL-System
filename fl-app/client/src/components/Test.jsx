import axios from "axios";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://127.0.0.1:5000");

const cleanLogText = (log) => {
  return log.replace(/\x1b\[[0-9;]*m/g, " | ");
};

const checkWorking = async () => {
  const res = await axios.get("http://127.0.0.1:5000/");
  console.log(res);
};

const App = () => {
  const [serverLogs, setServerLogs] = useState("");
  const [clientLogs, setClientLogs] = useState({});

  useEffect(() => {
    // Listen for server logs
    socket.on("server_log", (data) => {
      setServerLogs((prev) => prev + cleanLogText(data.log));
    });

    // Listen for client logs
    for (let clientId = 1; clientId <= 2; clientId++) {
      socket.on(`client_${clientId}_log`, (data) => {
        setClientLogs((prev) => ({
          ...prev,
          [clientId]: (prev[clientId] || "") + cleanLogText(data.log),
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
      <button onClick={checkWorking}>Check working</button>
      <div>
        <h3>Server Logs</h3>
        <pre>{serverLogs}</pre>
      </div>
      <div>
        <h3>Client Logs</h3>
        {Object.keys(clientLogs).map((clientId) => (
          <div key={clientId}>
            <h4>Client {clientId} Logs</h4>
            <pre>{clientLogs[clientId]}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};
export default App;
