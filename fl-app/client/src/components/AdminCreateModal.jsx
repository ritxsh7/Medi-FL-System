import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminCreateModal = ({ setIsModalOpen }) => {
  const navigate = useNavigate();
  const { id } = JSON.parse(localStorage.getItem("cookies"));
  const aggregateAlgorithms = ["WIFA", "FedAvg", "FedNova", "FedProx"];
  const models = ["YOLOv8", "U-Net", "EfficientNet"];

  const [sessionName, setSessionName] = useState("");
  const [numClients, setNumClients] = useState();
  const [numRounds, setNumRounds] = useState(50);
  const [aggregationAlgorithm, setAggregationAlgorithm] = useState("WIFA");
  const [model, setModel] = useState("YOLOv8");

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const body = {
      name: sessionName,
      numClients,
      adminId: id,
      numRounds,
      model,
      aggregationAlgorithm,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/server/create-session",
        body
      );
      const { session, message } = response.data;
      alert(message);
      navigate(`/admin/session?id=${session._id}`);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Create a New Session
        </h2>
        <input
          type="text"
          placeholder="Enter Session Name"
          value={sessionName}
          required
          onChange={(e) => setSessionName(e.target.value)}
          className="w-full text-md px-4 py-2 border rounded-sm focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <input
          type="text"
          placeholder="Enter no of clients"
          value={numClients}
          required
          onChange={(e) => setNumClients(e.target.value)}
          className="w-full text-md px-4 py-2 border rounded-sm focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <p className="text-xs text-gray-500 mb-1">Aggregation algorithm: </p>
        <select
          value={aggregationAlgorithm}
          onChange={(e) => setAggregationAlgorithm(e.target.value)}
          className="w-full text-md text-black px-4 py-2 border rounded-sm focus:ring-2 focus:ring-blue-400 mb-4"
        >
          {aggregateAlgorithms.map((algo) => (
            <option value={algo}>{algo}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mb-1">Training model: </p>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full text-md px-4 py-2 border rounded-sm focus:ring-2 focus:ring-blue-400 mb-4"
        >
          {models.map((model) => (
            <option value={model}>{model}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mb-1">Aggregation rounds: </p>
        <input
          type="text"
          placeholder="Enter no of rounds"
          value={numRounds}
          required
          onChange={(e) => setNumRounds(e.target.value)}
          className="w-full text-md px-4 py-2 border rounded-sm focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <div className="flex justify-between space-x-4 text-md">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-gray-600 border rounded-md w-3/5 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateSession}
            className="px-4 py-2 bg-blue-600 text-white rounded-md w-3/5 hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateModal;
