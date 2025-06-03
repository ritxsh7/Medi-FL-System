import React, { useEffect, useState } from "react";
import { FiSearch, FiKey } from "react-icons/fi";
import SessionCard from "../components/SessionCard";
import AdminCreateModal from "../components/AdminCreateModal";
import axios from "axios";
import { NavLink } from "react-router-dom";
import GenerateTokenModal from "../components/GenerateTokenModal";

const AdminDashboardPage = () => {
  document.title = "Admin interface";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [sessions, setSessions] = useState([]);

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
      <header className="text-center mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-700 relative inline-block">
          Your Sessions
        </h1>
        <div className="flex space-x-4">
          <button
            className="text-md px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            + Create New Session
          </button>
          <button
            className="text-md p-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            onClick={() => setIsTokenModalOpen(true)}
            title="Generate Token"
          >
            <FiKey className="text-xl" />
          </button>
        </div>
      </header>

      {/* Session Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions?.map((session) => (
          <NavLink to={`/model?id=${session._id}`} key={session._id}>
            <SessionCard session={session} />
          </NavLink>
        ))}
      </div>

      {isModalOpen && <AdminCreateModal setIsModalOpen={setIsModalOpen} />}
      {isTokenModalOpen && (
        <GenerateTokenModal setIsTokenModalOpen={setIsTokenModalOpen} />
      )}
    </div>
  );
};

export default AdminDashboardPage;
