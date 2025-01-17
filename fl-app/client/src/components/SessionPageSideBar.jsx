import React from "react";

const SessionPageSideBar = ({
  session,
  startServer,
  startTraining,
  isServerStarted,
}) => {
  return (
    <aside className="w-100 sticky top-[11vh] max-h-[89vh] bg-white shadow-lg p-4 flex flex-col">
      {/* Session Name */}
      <h2 className="text-lg font-semibold text-gray-600 mb-4">
        {session?.name}
      </h2>

      {/* Session Info */}
      <div className="text-gray-600 text-sm space-y-2">
        <p>
          <span className="font-medium">Session ID: </span>
          {session?._id}
        </p>
        <p>
          <span className="font-medium">Created By: </span>
          {session?.createdBy?.accessId}
        </p>
        <p
          className={`${
            session?.status === "pending"
              ? "text-orange-500"
              : session?.status === "in-progress"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          <span className="font-medium text-gray-600">Status: </span>
          {session?.status}
        </p>
        <p>
          <span className="font-medium">Total Clients: </span>
          {session?.numClients}
        </p>
      </div>
      {/* Joined Clients */}
      <div className="my-2 border-gray-200 border-y-[1px] py-2">
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Joined Clients: {session.clients.length} / {session.numClients}
        </h3>
        {session?.clients.length > 0 ? (
          <ul className="space-y-2 h-[180px] overflow-y-scroll">
            {session?.clients.map((client, index) => (
              <li
                key={index}
                className="border p-2 rounded-md border-gray-200 flex justify-between items-center shadow-sm hover:shadow-md transition"
              >
                <div>
                  <p className="text-sm text-gray-700">
                    Client ID: {client._id}
                  </p>
                  <p className="text-xs text-gray-500">
                    Joined at {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No clients have joined yet.</p>
        )}
      </div>
      {/* Buttons */}
      <div className="absolute bottom-4 w-[16rem]">
        {!isServerStarted ? (
          <button
            onClick={startServer}
            className="w-full text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 mb-2"
          >
            Start Server
          </button>
        ) : (
          <button
            onClick={startTraining}
            disabled={session.numClients !== session.clients.length}
            className="w-full text-sm px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
          >
            Start Training
          </button>
        )}
      </div>
    </aside>
  );
};

export default SessionPageSideBar;
