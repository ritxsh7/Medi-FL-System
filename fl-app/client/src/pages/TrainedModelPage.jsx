import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import LineChart from "../components/LineChart";

const TrainedModelPage = () => {
  const [query] = useSearchParams();
  const sessionId = query.get("sessionId");

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading session...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Session Details Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {session.name}
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
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
            <p>
              <strong>Aggregation Algorithm:</strong>{" "}
              {session.aggregationAlgorithm || "N/A"}
            </p>
          </div>
        </div>

        {/* Live Metrics Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Live Metrics
          </h3>
          <div className="h-64">
            <LineChart metrics={session.logs} />
          </div>
        </div>

        {/* Prediction Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-2 bg-gray-50">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-l-lg hover:bg-blue-200 transition"
              >
                Choose File
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
              <span className="flex-1 text-sm text-gray-600 px-4 py-2">
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition ${
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
              <h4 className="text-lg font-medium text-gray-900 text-center mb-2">
                Prediction Result
              </h4>
              <img
                src={`data:image/jpeg;base64,${predictedImage}`}
                alt="Predicted"
                className="mt-2 w-full rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainedModelPage;
