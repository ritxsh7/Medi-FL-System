import React, { useEffect, useState } from "react";
import SessionPageSideBar from "../components/SessionPageSideBar";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import LogsDisplay from "../components/LogsDisplay";
import LineChart from "../components/LineChart";
import io from "socket.io-client";

const { id } = JSON.parse(localStorage.getItem("cookies"));
const socket = io("http://127.0.0.1:5000");

const ClientSessionPage = () => {
  const [query] = useSearchParams();
  const sessionId = query.get("id");

  const [status, setStatus] = useState("Waiting for server...");
  const [session, setSession] = useState(null);
  const [clientLogs, setClientLogs] = useState("");
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [validationLogs, setValidationLogs] = useState([]);
  // console.log(trainingLogs);
  // console.log(validationLogs);

  // Pattern matching
  const trainingLogPattern =
    /Training Metrics, Accuracy = ([\d.]+), Loss = ([\d.]+)/;

  const validationLogPattern =
    /Validation Metrics, Accuracy = ([\d.]+), Loss = ([\d.]+)/;

  useEffect(() => {
    // Join the client room
    socket.emit("join", { role: "client", client_id: id });

    socket.on(`client_${id}_log`, (data) => {
      const logMessage = cleanLogText(data.log);
      setClientLogs((prev) => prev + logMessage);

      const trainingMatch = logMessage.match(trainingLogPattern);
      const validationMatch = logMessage.match(validationLogPattern);

      if (trainingMatch) {
        const structuredLog = {
          accuracy: parseFloat(trainingMatch[1]),
          loss: parseFloat(trainingMatch[2]),
        };
        setTrainingLogs((prev) => {
          return [...prev, structuredLog];
        });
      }

      if (validationMatch) {
        const structuredLog = {
          accuracy: parseFloat(validationMatch[1]),
          loss: parseFloat(validationMatch[2]),
        };
        setValidationLogs((prev) => {
          return [...prev, structuredLog];
        });
      }
    });

    socket.on("status_update", (data) => {
      setStatus(data.status);
    });

    return () => {
      socket.off(`client_${id}_log`);
      socket.off("status_update");
    };
  }, [id]);

  const fetchSessionDetails = async () => {
    const response = await axios.get(
      `http://localhost:5000/server/session/${sessionId}`
    );
    setSession(response.data.session);
    console.log(response.data);
  };

  useEffect(() => {
    fetchSessionDetails();
  }, [sessionId]);

  return (
    session && (
      <div className="min-h-screen bg-blue-50 flex text-left relative">
        <SessionPageSideBar session={session} />
        <main className="w-[70vw] flex flex-col p-4">
          <div className="bg-white shadow-md rounded-md p-2 mb-6 min-h-[40vh]">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Logs</h2>
            <LogsDisplay logs={clientLogs} />
          </div>
          <div className="bg-white shadow-md rounded-md p-2 mb-6 min-h-[40vh]">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Live Metrics
            </h2>
            <LineChart metrics={trainingLogs} />
            <LineChart metrics={validationLogs} />
          </div>
        </main>
      </div>
    )
  );
};

export default ClientSessionPage;
