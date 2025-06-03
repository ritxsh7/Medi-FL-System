const { spawn } = require("child_process");

const path = require("path");
const Session = require("../schemas/Session");
const clientPath = path.resolve(__dirname, "../../framework/client.py");
const serverPath = path.resolve(__dirname, "../../framework/server.py");

let serverProcess = null;
let clientProcesses = [];

let ioInstance;

const initializeProcessIO = (io) => {
  ioInstance = io;
};

const updateSessionStatus = async (sessionId, status) => {
  try {
    const session = await Session.findById(sessionId);
    session.status = status;
    await session.save();
    ioInstance.emit("session_update", {
      message: `Session ${sessionId} has been completed.`,
      session,
    });
  } catch (err) {
    console.error(`Error updating session ${sessionId} status:`, err);
  }
};

// Stream logs to Socket.IO
const streamLogs = (process, eventName, id) => {
  try {
    process.stdout.on("data", (data) => {
      ioInstance.emit(eventName, { log: data.toString() });
    });

    process.stderr.on("data", (data) => {
      ioInstance.emit(eventName, { log: data.toString() });
    });
    console.log(`Sent logs to ${id}`);
  } catch (err) {
    console.log(err);
  }
};

// Start the Flower server process
const startServerProcess = (id, num_clients, aggregator) => {
  if (serverProcess) {
    throw "Server already running";
  }

  serverProcess = spawn(
    "python",
    [
      `"${serverPath}"`,
      `--num_rounds=${num_clients}`,
      // `--aggregator=${aggregator}`,
    ],
    {
      shell: true,
    }
  );

  streamLogs(serverProcess, "server_log", "admin");

  serverProcess.on("close", (code) => {
    console.log(`Server process exited with code ${code}`);
    serverProcess = null;
    if (code === 0) {
      updateSessionStatus(id, "completed");
    }
  });

  return true;
};

// Start client processes
const startClientProcesses = (clients) => {
  if (clientProcesses.length > 0) {
    throw "Client processes are already running";
  }

  for (let client of clients) {
    const clientProcess = spawn(
      "python",
      [`"${clientPath}"`, `--dir="${client.dir}"`],
      { shell: true }
    );

    streamLogs(
      clientProcess,
      `client_${client._id}_log`,
      `client_${client._id}`
    );

    clientProcess.on("close", (code) => {
      console.log(`Client ${client._id} process exited with code ${code}`);
      clientProcesses = clientProcesses.filter((p) => p !== clientProcess);
    });

    clientProcesses.push(clientProcess);
  }
  return true;
};

// Stop all processes
const stopAllProcesses = () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }

  clientProcesses.forEach((process) => process.kill());
  clientProcesses = [];
};

module.exports = {
  startServerProcess,
  startClientProcesses,
  stopAllProcesses,
  initializeProcessIO,
};
