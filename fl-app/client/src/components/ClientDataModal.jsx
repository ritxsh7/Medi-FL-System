import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ClientDataModal = ({
  sessionId,
  dataPath,
  setDataPath,
  setIsDataModalOpen,
}) => {
  const navigate = useNavigate();

  const { accessId } = JSON.parse(localStorage.getItem("cookies"));

  const handleSubmitPath = async () => {
    const body = { sessionId, dataPath, accessId };

    try {
      const response = await axios.post(
        "http://localhost:5000/server/submit-data",
        body
      );
      console.log(response);
      alert(response.data.message);
      navigate(`/client/session?id=${sessionId}`);
      setIsDataModalOpen(false);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 w-96 items-center flex-col flex text-left">
        <h2 className="text-xl text-left font-semibold text-gray-800 mb-1">
          Provide local dataset
        </h2>
        <p className="text-xs text-gray-600 mb-2">
          The selected model requires dataset in YOLO v8 format
        </p>
        <input
          type="text"
          placeholder="Enter /path/to/dataset"
          required
          onChange={(e) => setDataPath(e.target.value)}
          className="w-full text-md px-4 py-2 border rounded-sm focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md w-3/5 hover:bg-blue-700"
          onClick={handleSubmitPath}
        >
          Proceed to session
        </button>
      </div>
    </div>
  );
};

export default ClientDataModal;
