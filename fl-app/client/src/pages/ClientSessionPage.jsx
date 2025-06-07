import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { cleanLogText, chartData, chartOptions } from "../utils/ui";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import LineChart from "../components/LineChart";
import LogsDisplay from "../components/LogsDisplay";
import { useSearchParams } from "react-router-dom";
import SessionPageSideBar from "../components/SessionPageSideBar";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const cookies = localStorage.getItem("cookies");
const { id, accessId } = cookies
  ? JSON.parse(cookies)
  : { id: "", accessId: "" };
const socket = io("http://127.0.0.1:5000");

const ClientSessionPage = () => {
  const [query] = useSearchParams();
  const sessionId = query.get("id");

  const [status, setStatus] = useState("Waiting for server...");
  const [initialAccuracySet, setInitialAccuracySet] = useState(false);
  const [session, setSession] = useState(null);
  const [clientLogs, setClientLogs] = useState("");
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [validationLogs, setValidationLogs] = useState([]);
  const [classCounts, setClassCounts] = useState({});
  const [labels, setLabels] = useState([]);
  const [counts, setCounts] = useState([]);
  const [performance, setPerformance] = useState({
    initialAccuracy: 0,
    bestAccuracy: 0,
  });

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
          const newLogs = [...prev, structuredLog];
          // Set initialAccuracy for the first log
          if (!initialAccuracySet) {
            setPerformance((prev) => ({
              ...prev,
              initialAccuracy: structuredLog.accuracy,
            }));
            setInitialAccuracySet(true);
          }
          // Update bestAccuracy if current accuracy is higher
          if (structuredLog.accuracy > performance.bestAccuracy) {
            setPerformance((prev) => ({
              ...prev,
              bestAccuracy: structuredLog.accuracy,
            }));
          }
          return newLogs;
        });
      }

      if (validationMatch) {
        const structuredLog = {
          accuracy: parseFloat(validationMatch[1]),
          loss: parseFloat(validationMatch[2]),
        };
        setValidationLogs((prev) => [...prev, structuredLog]);
      }
    });

    socket.on("session_update", (data) => {
      setSession(data.session);
    });

    return () => {
      socket.off(`client_${id}_log`);
      socket.off("session_update");
    };
  }, [id, initialAccuracySet, performance.bestAccuracy]);

  const fetchSessionDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/server/session/${sessionId}`
      );
      setSession(response.data.session);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDoneClick = async () => {
    try {
      await axios.post(
        `http://localhost:5000/client/saveperformamce/${session._id}`,
        { performance }
      );
      alert("Model updated in the database successfully.");
    } catch (error) {
      console.error("Failed to save performance:", error);
      alert("Failed to save performance.");
    }
  };

  useEffect(() => {
    fetchSessionDetails();
  }, [sessionId]);

  // Update classCounts, labels, and counts when session changes
  useEffect(() => {
    if (session?.classCounts) {
      const clientData =
        session.classCounts.find((s) => s.clientId === accessId) || {};
      setClassCounts(clientData.data || {});
      const newLabels = [];
      const newCounts = [];
      for (const [key, value] of Object.entries(clientData.data || {})) {
        newLabels.push(key);
        newCounts.push(value);
      }
      setLabels(newLabels);
      setCounts(newCounts);
    }
  }, [session, accessId]);

  return (
    session && (
      <div className="min-h-screen bg-blue-50 flex text-left">
        <SessionPageSideBar
          session={session}
          handleDoneClick={handleDoneClick}
        />
        <main className="flex-1 p-4">
          <div className="flex flex-row w-[80vw] gap-4">
            <div className="bg-white w-1/2 shadow-md rounded-md p-4">
              <div className="bg-white shadow-md rounded-md p-4 mb-4">
                <h3 className="text-xl font-semibold text-gray-600 mb-4">
                  Class Distribution
                </h3>
                <div style={{ height: "300px" }}>
                  <Bar
                    data={chartData(labels, counts)}
                    options={chartOptions}
                  />
                </div>
              </div>
              <div className="my-4">
                <h3 className="text-xl font-semibold text-gray-600 mb-4">
                  Model Performance
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-600">
                      Initial Accuracy
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {(performance.initialAccuracy * 100).toFixed(2)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Accuracy of the original modal (client-own)
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-600">
                      Best Accuracy
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {(performance.bestAccuracy * 100).toFixed(2)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Accuracy achieved during training (client-all)
                    </p>
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Live Metrics
              </h2>
              <LineChart metrics={trainingLogs} text="Client-All accuracy" />
              <LineChart
                metrics={validationLogs}
                text="Client data validation"
              />
            </div>
            <div className="bg-white w-1/2 shadow-md rounded-md p-4 h-[200vh]">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Logs</h2>
              <LogsDisplay logs={clientLogs} />
            </div>
          </div>
        </main>
      </div>
    )
  );
};

export default ClientSessionPage;
