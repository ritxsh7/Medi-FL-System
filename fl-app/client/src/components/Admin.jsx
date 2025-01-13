import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { cleanLogText } from "../utils/ui";
import axios from "axios";

const socket = io("http://127.0.0.1:5000");

const AdminUI = () => {
  /*AdminUI component here */

  const [serverLogs, setServerLogs] = useState("");
  const [messages, setMessages] = useState("");
  const [structuredLogs, setStructuredLogs] = useState([]);
  console.log(structuredLogs);

  useEffect(() => {
    // Join the admin room
    socket.emit("join", { role: "admin" });

    // Listen for server logs
    socket.on("server_log", (data) => {
      const logMessage = cleanLogText(data.log);
      setServerLogs((prev) => prev + logMessage);

      const logPattern =
        /After round (\d+), Global accuracy = ([\d.]+), Loss = ([\d.]+)/;
      const match = logMessage.match(logPattern);

      if (match) {
        const structuredLog = {
          round: parseInt(match[1], 10),
          accuracy: parseFloat(match[2]),
          loss: parseFloat(match[3]),
        };

        setStructuredLogs((prev) => [...prev, structuredLog]);
      }
    });

    return () => {
      socket.off("server_log");
    };
  }, []);

  const startServer = async () => {
    const response = await axios.post("http://127.0.0.1:5000/start_server");
    setMessages((msg) => msg + "\n" + response.data.message);
  };

  const startTraining = async () => {
    const response = await axios.post("http://127.0.0.1:5000/start_clients", {
      num_clients: 2,
    });
    setMessages((msg) => msg + "\n" + response.data.message);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Interface
        </h1>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={startServer}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
          >
            Start Server
          </button>

          <button
            onClick={startTraining}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-200"
          >
            Start Training
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Messages</h2>
          <div className="p-4 bg-gray-50 border border-gray-300 rounded h-32 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {messages}
            </pre>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Server Logs
          </h2>
          <div className="p-4 bg-gray-800 border border-gray-600 rounded h-64 overflow-y-auto">
            <pre className="text-sm text-left text-lime-500 whitespace-pre-wrap">
              {serverLogs}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUI;
