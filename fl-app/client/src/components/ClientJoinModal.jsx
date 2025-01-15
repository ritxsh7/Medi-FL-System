import React, { useState } from "react";

const ClientJoinModal = ({ setIsModalOpen }) => {
  const [sessionId, setSessionId] = useState("");

  const handleJoinSession = (e) => {
    e.preventDefault();
    alert("Session joined. Id: ", sessionId);
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Join a New Session
        </h2>
        <input
          type="text"
          placeholder="Enter Session ID"
          value={sessionId}
          required
          onChange={(e) => setSessionId(e.target.value)}
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
