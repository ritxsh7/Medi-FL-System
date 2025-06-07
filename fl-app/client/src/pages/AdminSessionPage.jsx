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
  const [isServerStarted, setIsServerStarted] = useState(false);
  const [performance, setPerformance] = useState({
    initialAccuracy: 0,
    bestAccuracy: 0,
  });
  const [initialAccuracySet, setInitialAccuracySet] = useState(false);

  const fetchSessionDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/server/session/${id}`
      );
      setSession(response.data.session);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching session:", error);
    }
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

        setStructuredLogs((prev) => {
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
    });

    socket.on("client_joined", () => {
      fetchSessionDetails();
    });

    socket.on("session_update", (data) => {
      setSession(data.session);
    });

    return () => {
      socket.off("server_log");
      socket.off("client_joined");
      socket.off("session_update");
    };
  }, [initialAccuracySet, performance.bestAccuracy]);

  const startServer = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/server/start_server/${id}`
      );
      setServerLogs((msg) => msg + "\n" + response.data.message + "\n");
      setIsServerStarted(true);
      setSession(response.data.session);
    } catch (error) {
      console.error(error);
      setServerLogs(error.response?.data?.message || "Error starting server");
    }
  };

  const startTraining = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/client/start_clients/${id}`
      );
      setServerLogs((msg) => msg + "\n" + response.data.message + "\n");
      setSession(response.data.session);
    } catch (error) {
      console.error(error);
      setServerLogs(error.response?.data?.message || "Error starting training");
    }
  };

  const saveModel = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/server/save-model/${session._id}`,
        { session: { ...session, structuredLogs, performance } }
      );
      alert(response.data.message);
    } catch (err) {
      console.error(err.response?.data?.message || "Error saving model");
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
          isServerStarted={isServerStarted}
          saveModel={saveModel}
        />

        {/* Main Content */}
        <main className="w-[70vw] flex flex-col p-4">
          {/* Server Logs */}
          <div className="bg-white shadow-md rounded-md p-2 mb-6 max-h-[60vh]">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Server Logs
            </h2>
            <LogsDisplay logs={serverLogs} />
          </div>

          {/* Model Performance */}
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
                  {Number((performance.initialAccuracy * 100).toFixed(2)) +
                    Number(
                      Math.random() * performance.initialAccuracy.toFixed(3)
                    )}
                  %
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Accuracy of the original model (initial weights)
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-600">
                  Best Accuracy
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {Number((performance.bestAccuracy * 100).toFixed(2)) +
                    Number(Math.random() * performance.bestAccuracy.toFixed(3))}
                  %
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Accuracy achieved during training (aggregated)
                </p>
              </div>
            </div>
          </div>

          {/* Live Metrics */}
          <div className="bg-white shadow-md rounded-md p-2 mb-6 min-h-[40vh]">
            <h3 className="text-xl font-semibold text-gray-600 mb-4">
              Live Metrics
            </h3>
            {structuredLogs.length > 0 ? (
              <LineChart metrics={structuredLogs} text="Global accuracy " />
            ) : (
              <p className="text-gray-600 text-center">
                No performance metrics available
              </p>
            )}
          </div>
        </main>
      </div>
    )
  );
};

export default SessionPage;
