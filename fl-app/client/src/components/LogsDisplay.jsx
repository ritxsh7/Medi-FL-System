import React, { useEffect, useRef } from "react";

const LogsDisplay = ({ logs }) => {
  const logsRef = useRef(null);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={logsRef}
      className="p-4 bg-gray-800 h-[90%] border border-gray-600 rounded overflow-y-scroll"
    >
      <pre className="text-md text-left text-lime-500 whitespace-pre-wrap">
        {logs}
      </pre>
    </div>
  );
};

export default LogsDisplay;
