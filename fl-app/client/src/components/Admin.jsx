import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { cleanLogText } from "../utils/ui";
import axios from "axios";

const socket = io("http://127.0.0.1:5000");

const AdminUI = () => {
  const [serverLogs, setServerLogs] = useState("");
  const [messages, setMessages] = useState("");

  useEffect(() => {
    // Join the admin room
    socket.emit("join", { role: "admin" });

    // Listen for server logs
    socket.on("server_log", (data) => {
      setServerLogs((prev) => prev + cleanLogText(data.log));
    });

    return () => {
      socket.off("server_log");
    };
  }, []);

  const startServer = async () => {
    const response = await axios.post("http://127.0.0.1:5000/start_server");
    setMessages((msg) => msg + "\n" + response.data);
  };

  const startTraining = async () => {
    const response = await axios.post("http://127.0.0.1:5000/start_clients", {
      num_clients: 2,
    });
    setMessages((msg) => msg + "\n" + response.data);
  };
  return (
    <div>
      <h1>Admin Interface</h1>
      <button onClick={startServer}>Start server</button>
      <button onClick={startTraining}>Start training</button>
      <p>{messages}</p>
      <h2>Server Logs</h2>
      <pre>{serverLogs}</pre>
    </div>
  );
};

export default AdminUI;
