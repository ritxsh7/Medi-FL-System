const { spawn } = require("child_process");

const path = require("path");
const clientPath = path.resolve(__dirname, "../../framework/client.py");
const serverPath = path.resolve(__dirname, "../../framework/server.py");

console.log(clientPath, serverPath);

let serverProcess = null;
let clientProcesses = [];

console.log(clientProcesses);

let ioInstance;

const initializeProcessIO = (io) => {
  ioInstance = io;
};

// Stream logs to Socket.IO
const streamLogs = (process, eventName, id) => {
  try {
    process.stdout.on("data", (data) => {
      ioInstance.emit(eventName, { log: data.toString() });
    });

    process.stderr.on("data", (data) => {
      ioInstance.emit(eventName, { log: data.toString() });
      console.log(data.toString());
    });
    console.log(`Sent logs to ${id}`);
  } catch (err) {
    console.log(err);
  }
};

// Start the Flower server process
const startServerProcess = (res) => {
  if (serverProcess) {
    res
      .status(400)
      .json({ status: "error", message: "Server already running" });
    return;
  }

  serverProcess = spawn("python", [`"${serverPath}"`], {
    shell: true,
  });

  streamLogs(serverProcess, "server_log", "admin");

  serverProcess.on("close", (code) => {
    console.log(`Server process exited with code ${code}`);
    serverProcess = null;
  });

  res.json({ status: "success", message: "Server started" });
};

// Start client processes
const startClientProcesses = (clients, res) => {
  if (clientProcesses.length > 0) {
    return res
      .status(400)
      .json({ status: "error", message: "Clients already running" });
  }

  for (let client of clients) {
    const clientProcess = spawn(
      "python",
      [`"${clientPath}"`, `--client_id=${client._id.slice(0, 4)}`],
      { shell: true }
    );

    streamLogs(
      clientProcess,
      `client_${client._id}_log`,
      `client_${client._id}`
    );

    clientProcess.on("close", (code) => {
      console.log(`Client ${client._id} process exited with code ${code}`);
    });

    clientProcesses.push(clientProcess);
  }

  res.json({ status: "success", message: `${clients.length} clients started` });
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
