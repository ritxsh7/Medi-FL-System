import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { cleanLogText } from "../utils/ui";
import axios from "axios";
import LineChart from "../components/LineChart";
import LogsDisplay from "../components/LogsDisplay";
import { useSearchParams } from "react-router-dom";
import SessionPageSideBar from "../components/SessionPageSideBar";

const socket = io("http://127.0.0.1:5000");

const SessionPage = () => {
  const [query] = useSearchParams();
  const id = query.get("id");

  const [serverLogs, setServerLogs] = useState("");
  const [structuredLogs, setStructuredLogs] = useState([]);
  const [session, setSession] = useState(null);
  const [isServedStarted, setIsServerStarted] = useState(false);

  const fetchSessionDetails = async () => {
    const response = await axios.get(
      `http://localhost:5000/server/session/${id}`
    );
    setSession(response.data.session);
    console.log(response.data);
  };

  useEffect(() => {
    fetchSessionDetails();
  }, [id]);

  useEffect(() => {
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

    socket.on("client_joined", () => {
      fetchSessionDetails();
    });

    return () => {
      socket.off("server_log");
    };
  }, []);

  const startServer = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/server/start_server"
      );
      setServerLogs((msg) => msg + "\n" + response.data.message + "\n");
      setIsServerStarted(true);
    } catch (error) {
      console.log(error);
      setServerLogs(error.response.data.message);
    }
  };

  const startTraining = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/client/start_clients",
        { num_clients: session.numClients, clients: session.clients }
      );
      setServerLogs((msg) => msg + "\n" + response.data.message + "\n");
    } catch (error) {
      console.log(error);
      setServerLogs(error.response.data.message);
    }
  };

  return (
    session && (
      <div className="min-h-screen bg-blue-50 flex text-left relative">
        {/* Left Sidebar */}
        <SessionPageSideBar
          session={session}
          startServer={startServer}
          startTraining={startTraining}
          isServerStarted={isServedStarted}
        />

        {/* Main Content */}
        <main className="w-[70vw] flex flex-col p-4">
          {/* Live Metrics */}
          <div className="bg-white shadow-md rounded-md p-2 mb-6 min-h-[40vh]">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Server Logs
            </h2>
            <LogsDisplay logs={serverLogs} />
          </div>

          <div className="bg-white shadow-md rounded-md p-2 mb-6 min-h-[40vh]">
            <h3 className="text-xl font-semibold text-gray-600 mb-4">
              Live Metrics
            </h3>
            <LineChart metrics={structuredLogs} />
          </div>
        </main>
      </div>
    )
  );
};

export default SessionPage;
