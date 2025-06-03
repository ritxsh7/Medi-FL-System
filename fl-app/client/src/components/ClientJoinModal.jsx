import React, { useState } from "react";
import axios from "axios";

// Client-side token decoding
const decodeAuthToken = (token) => {
  try {
    const clientAccessId = atob(token);
    if (
      clientAccessId !== JSON.parse(localStorage.getItem("cookies")).accessId
    ) {
      throw new Error("Invalid token: No Client Access ID found");
    }
    return clientAccessId;
  } catch (error) {
    throw new Error(`Token decoding failed: ${error.message}`);
  }
};

const ClientJoinModal = ({
  sessionId,
  setSessionId,
  setIsModalOpen,
  setIsDataModalOpen,
}) => {
  const [privateKey, setPrivateKey] = useState("");
  const { id } = JSON.parse(localStorage.getItem("cookies")) || {};

  const handleJoinSession = async (e) => {
    e.preventDefault();

    // Decode the private key (token) before sending
    let clientAccessId;
    try {
      clientAccessId = decodeAuthToken(privateKey);
    } catch (error) {
      alert(error.message);
      return;
    }

    const body = { sessionId, clientId: id, clientAccessId };
    try {
      const response = await axios.post(
        "http://localhost:5000/server/join-session",
        body
      );
      alert(response.data.message);
      setIsDataModalOpen(true);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to join session");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Join a New Session
        </h2>
        <input
          type="text"
          placeholder="Enter Session ID"
          value={sessionId}
          required
          onChange={(e) => setSessionId(e.target.value)}
          className="w-full text-md px-4 py-2 border rounded-sm focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <input
          type="text"
          placeholder="Enter Private Key"
          value={privateKey}
          required
          onChange={(e) => setPrivateKey(e.target.value)}
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
            onClick={handleJoinSession}
            className="px-4 py-2 bg-blue-600 text-white rounded-md w-3/5 hover:bg-blue-700"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientJoinModal;
