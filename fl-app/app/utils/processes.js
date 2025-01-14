const { spawn } = require("child_process");

let serverProcess = null;
let clientProcesses = [];

let ioInstance;

const initialize = (io) => {
  ioInstance = io;
};

// Stream logs to Socket.IO
const streamLogs = (process, eventName) => {
  process.stdout.on("data", (data) => {
    ioInstance.emit(eventName, { log: data.toString() });
  });

  process.stderr.on("data", (data) => {
    ioInstance.emit(eventName, { log: data.toString() });
  });
};

// Start the Flower server process
const startServerProcess = (res) => {
  if (serverProcess) {
    res
      .status(400)
      .json({ status: "error", message: "Server already running" });
    return;
  }

  serverProcess = spawn("python", ["../framework/server.py"], { shell: true });

  streamLogs(serverProcess, "server_log");

  serverProcess.on("close", (code) => {
    console.log(`Server process exited with code ${code}`);
    serverProcess = null;
  });

  res.json({ status: "success", message: "Server started" });
};

// Start client processes
const startClientProcesses = (num_clients, res) => {
  if (clientProcesses.length > 0) {
    res
      .status(400)
      .json({ status: "error", message: "Clients already running" });
    return;
  }

  for (let clientId = 1; clientId <= num_clients; clientId++) {
    const clientProcess = spawn(
      "python",
      ["../framework/client.py", `--client_id=${clientId}`],
      { shell: true }
    );

    streamLogs(clientProcess, `client_${clientId}_log`);

    clientProcess.on("close", (code) => {
      console.log(`Client ${clientId} process exited with code ${code}`);
    });

    clientProcesses.push(clientProcess);
  }

  res.json({ status: "success", message: `${num_clients} clients started` });
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
  initialize,
};
