import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import SessionCard from "../components/SessionCard";
import AdminCreateModal from "../components/AdminCreateModal";

const AdminDashboardPage = () => {
  document.title = "Admin interface";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sessions = [
    {
      id: 1,
      name: "Cardiology Collaboration",
      date: "2025-01-10",
      info: {
        localAccuracy: "85%",
        globalAccuracy: "90%",
        clients: 5,
        initiatedBy: "Dr. John Doe",
      },
    },
    {
      id: 2,
      name: "Neurology Analysis",
      date: "2025-01-08",
      info: {
        localAccuracy: "88%",
        globalAccuracy: "92%",
        clients: 3,
        initiatedBy: "Dr. Jane Smith",
      },
    },
  ];

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
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          + Create New Session
        </button>
      </header>

      {/* Session Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((session) => (
          <SessionCard session={session} />
        ))}
      </div>

      {isModalOpen && <AdminCreateModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};

export default AdminDashboardPage;
