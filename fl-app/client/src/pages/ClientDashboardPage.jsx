import React from "react";
import { FiSearch } from "react-icons/fi";
import SessionCard from "../components/SessionCard";
import ClientJoinModal from "../components/ClientJoinModal";
import { useState, useEffect } from "react";
import axios from "axios";
import ClientDataModal from "../components/ClientDataModal";

const ClientDashboardPage = () => {
  document.title = "Client Interface";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [dataPath, setDataPath] = useState("");
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  const [sessions, setSessions] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/sessions");
        setSessions(response.data.sessions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      {/* Search Bar */}
      <div className="flex items-center mb-6 w-full md:w-1/2 mx-auto">
        <FiSearch className="text-gray-400 text-xl mr-2 translate-x-10" />
        <input
          type="text"
          placeholder="Search sessions..."
          className="w-full px-4 pl-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Header */}
      <header className="text-center mb-8 flex justify-between">
        <h1 className="text-2xl font-bold text-gray-700 relative inline-block">
          Your Sessions
        </h1>
        <button
          className="text-md px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          onClick={handleOpenModal}
        >
          + Join New Session
        </button>
      </header>

      {/* Session Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions?.map((session) => (
          <SessionCard session={session} />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ClientJoinModal
          sessionId={sessionId}
          setSessionId={setSessionId}
          setIsModalOpen={setIsModalOpen}
          setIsDataModalOpen={setIsDataModalOpen}
        />
      )}
      {isDataModalOpen && (
        <ClientDataModal
          sessionId={sessionId}
          dataPath={dataPath}
          setDataPath={setDataPath}
          setIsDataModalOpen={setIsDataModalOpen}
        />
      )}
    </div>
  );
};

export default ClientDashboardPage;
