import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const ClientDataPage = () => {
  const [query] = useSearchParams();
  const sessionId = query.get("id");

  // State for file upload and prediction
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictedImage, setPredictedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  // Fetch session details
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/server/session/${sessionId}`
        );
        setSession(response.data.session);
      } catch (error) {
        setError("Failed to fetch session data.");
        console.error("Error fetching session:", error);
      }
    };

    if (sessionId) fetchSession();
  }, [sessionId]);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPredictedImage(null);
    setError(null);
  };

  // Handle form submission for prediction
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5555/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "json",
        }
      );

      if (response.data.status === "success") {
        setPredictedImage(response.data.image);
      } else {
        setError(response.data.error || "Failed to process image.");
      }
    } catch (err) {
      setError("Error uploading image: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading and error states
  if (!session && !error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700 text-xl font-medium">Loading session...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600 text-xl font-medium">{error}</p>
      </div>
    );
  }

  // Define colors for categories
  const categoryColors = {
    caries: "#3B82F6", // Blue
    corona: "#EF4444", // Red
    endodoncia: "#10B981", // Green
    impacted: "#F59E0B", // Yellow
    implant: "#8B5CF6", // Purple
  };

  // Prepare chart data for each client
  const charts = session.classCounts.map((client) => ({
    clientId: client.clientId,
    data: {
      labels: Object.keys(client.data),
      datasets: [
        {
          label: `${client.clientId} Data`,
          data: Object.values(client.data),
          backgroundColor: Object.keys(client.data).map(
            (key) => categoryColors[key]
          ),
          borderColor: Object.keys(client.data).map(
            (key) => categoryColors[key]
          ),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: `${client.clientId} Class Distribution`,
          font: { size: 18 },
          color: "#111827",
          padding: { top: 10, bottom: 10 },
        },
        tooltip: {
          backgroundColor: "#1F2937",
          titleFont: { size: 14 },
          bodyFont: { size: 12 },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Count",
            color: "#111827",
            font: { size: 14 },
          },
          ticks: {
            color: "#111827",
            font: { size: 12 },
          },
          grid: {
            color: "#E5E7EB",
          },
        },
        x: {
          title: {
            display: true,
            text: "Categories",
            color: "#111827",
            font: { size: 14 },
          },
          ticks: {
            color: "#111827",
            font: { size: 12 },
          },
          grid: {
            display: false,
          },
        },
      },
    },
  }));

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto space-y-10">
        {/* Session Details Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {session.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
            <p>
              <strong>Date:</strong>{" "}
              {new Date(session.createdAt).toLocaleDateString() || "N/A"}
            </p>
            <p>
              <strong>Number of Clients:</strong> {session.numClients || 0}
            </p>
            <p>
              <strong>Initiated by:</strong>{" "}
              {session.createdBy?.accessId || "N/A"}
            </p>
            <p>
              <strong>Model:</strong> {session.model || "N/A"}
            </p>
            <p className="sm:col-span-2">
              <strong>Aggregation Algorithm:</strong>{" "}
              {session.aggregationAlgorithm || "N/A"}
            </p>
          </div>
        </div>

        <div className="max-w-[100vw] flex w-full gap-2">
          {/* Live Metrics Card */}
          <div className="bg-white w-1/2  p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Live Metrics
            </h3>
            <div className="h-64">
              <LineChart metrics={session.logs} />
            </div>
          </div>

          {/* Client Data Charts */}
          <div className="bg-white p-8 w-1/2 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Client Data Distribution
            </h3>
            <div className="space-y-10">
              {charts.map((chart, index) => (
                <div key={index} className="h-80">
                  <Bar data={chart.data} options={chart.options} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prediction Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3 bg-gray-50">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Choose Image
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
              <span className="flex-1 text-sm text-gray-700 px-4 py-2 truncate">
                {selectedFile ? selectedFile.name : "No image selected"}
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Upload and Predict"}
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}

          {predictedImage && (
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 text-center mb-4">
                Prediction Result
              </h4>
              <img
                src={`data:image/jpeg;base64,${predictedImage}`}
                alt="Predicted"
                className="mt-2 w-full rounded-lg shadow-md max-h-96 object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDataPage;
