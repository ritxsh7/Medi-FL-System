import React, { useState } from "react";

// Client-side token generation (Base64 encoding)
const generateAuthToken = (clientAccessId) => {
  return btoa(clientAccessId);
};

// const generateEncryptionToken()

const GenerateTokenModal = ({ setIsTokenModalOpen }) => {
  const [token, setToken] = useState("");
  const [clientAccessId, setClientAccessId] = useState("");

  const handleGenerateToken = () => {
    if (!clientAccessId) {
      alert("Client Access ID is required.");
      return;
    }
    const newToken = generateAuthToken(clientAccessId);
    setToken(newToken);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Generate Authentication Token
        </h2>
        <input
          type="text"
          placeholder="Enter Client Access ID"
          value={clientAccessId}
          required
          onChange={(e) => setClientAccessId(e.target.value)}
          className="w-full text-md px-4 py-2 border rounded-sm focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <div className="mb-4">
          {token ? (
            <div className="w-full text-md px-4 py-2 border rounded-sm bg-gray-100 break-all">
              {token}
            </div>
          ) : (
            <p className="text-gray-600">
              Enter Client Access ID and click below to generate an auth token
            </p>
          )}
        </div>
        <div className="flex justify-between space-x-4 text-md">
          <button
            onClick={() => setIsTokenModalOpen(false)}
            className="px-4 py-2 text-gray-600 border rounded-md w-3/5 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateToken}
            className="px-4 py-2 bg-blue-600 text-white rounded-md w-3/5 hover:bg-blue-700"
          >
            Generate Token
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateTokenModal;
