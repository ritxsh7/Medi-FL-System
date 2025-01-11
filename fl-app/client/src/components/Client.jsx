import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { cleanLogText } from "../utils/ui";

const socket = io("http://127.0.0.1:5000");

const ClientUI = () => {
  const [clientLogs, setClientLogs] = useState("");
  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    // Join the client room
    socket.emit("join", { role: "client", client_id: id });

    // Listen for client-specific logs
    socket.on(`client_${id}_log`, (data) => {
      setClientLogs((prev) => prev + cleanLogText(data.log));
    });

    return () => {
      socket.off("client_1_log");
    };
  }, [id]);

  return (
    <div>
      <h1>Client {id} Interface</h1>
      <h2>Logs</h2>
      <pre>{clientLogs}</pre>
    </div>
  );
};

export default ClientUI;
