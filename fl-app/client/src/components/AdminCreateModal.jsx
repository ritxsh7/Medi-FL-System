import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminCreateModal = ({ setIsModalOpen }) => {
  const [sessionName, setSessionName] = useState("");
  const [numClients, setNumClients] = useState();
  const navigate = useNavigate();
  const { id } = JSON.parse(localStorage.getItem("cookies"));

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const body = { name: sessionName, numClients, adminId: id };
    try {
      const response = await axios.post(
        "http://localhost:5000/server/create-session",
        body
      );
      const { session, message } = response.data;
      alert(message);
      navigate(`/session?id=${session._id}`);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Create a New Session
        </h2>
        <input
          type="text"
          placeholder="Enter Session Name"
          value={sessionName}
          required
          onChange={(e) => setSessionName(e.target.value)}
          className="w-full text-sm px-4 py-2 border rounded-sm focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <input
          type="text"
          placeholder="Enter no of clients"
          value={numClients}
          required
          onChange={(e) => setNumClients(e.target.value)}
          className="w-full text-sm px-4 py-2 border rounded-sm focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <div className="flex justify-between space-x-4 text-sm">
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
