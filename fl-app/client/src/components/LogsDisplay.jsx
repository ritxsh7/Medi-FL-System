import React, { useEffect, useRef } from "react";

const LogsDisplay = ({ logs }) => {
  const logsRef = useRef(null);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight; // Auto-scroll to the bottom
    }
  }, [logs]);

  return (
    <div
      ref={logsRef}
      className="p-4 bg-gray-800 border border-gray-600 rounded h-64 overflow-y-auto"
    >
      <pre className="text-sm text-left text-lime-500 whitespace-pre-wrap">
        {logs}
      </pre>
    </div>
  );
};

export default LogsDisplay;
