import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { cleanLogText } from "../utils/ui";
import LineChart from "./LineChart";
import LogsDisplay from "./LogsDisplay";

const socket = io("http://127.0.0.1:5000");

const ClientUI = () => {
  /* ClientUI component here */

  // Local states
  const [clientLogs, setClientLogs] = useState("");
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [validationLogs, setValidationLogs] = useState([]);
  // console.log(trainingLogs);
  // console.log(validationLogs);

  const [status, setStatus] = useState("Waiting for server...");

  // Parsing id from the parameter (temporary)
  const { id } = useParams();
  // console.log(id);

  // Pattern matching
  const trainingLogPattern =
    /Training Metrics, Accuracy = ([\d.]+), Loss = ([\d.]+)/;

  const validationLogPattern =
    /Validation Metrics, Accuracy = ([\d.]+), Loss = ([\d.]+)/;

  useEffect(() => {
    // Join the client room
    socket.emit("join", { role: "client", client_id: id });

    // Listen for client-specific logs
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

    // Listen for status updates
    socket.on("status_update", (data) => {
      setStatus(data.status);
    });

    return () => {
      socket.off(`client_${id}_log`);
      socket.off("status_update");
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Client Interface
        </h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Status</h2>
          <div className="p-4 bg-gray-50 border border-gray-300 rounded">
            <p className="text-sm text-gray-700">{status}</p>
          </div>
        </div>
        <div>
          <LineChart metrics={trainingLogs} />
          <LineChart metrics={validationLogs} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Logs</h2>
          <LogsDisplay logs={clientLogs} />
        </div>
      </div>
    </div>
  );
};

export default ClientUI;
