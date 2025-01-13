const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Global variables to store server and client processes
let serverProcess = null;
let clientProcesses = [];

// Stream logs to Socket.IO
const streamLogs = (process, eventName) => {
  process.stdout.on("data", (data) => {
    io.emit(eventName, { log: data.toString() });
  });

  process.stderr.on("data", (data) => {
    io.emit(eventName, { log: data.toString() });
  });
};

// Start the server process
app.post("/start_server", (req, res) => {
  if (serverProcess) {
    return res
      .status(400)
      .json({ status: "error", message: "Server already running" });
  }

  // Start the Flower server
  serverProcess = spawn("python", ["framework/server.py"], { shell: true });

  // Stream server logs
  streamLogs(serverProcess, "server_log");

  serverProcess.on("close", (code) => {
    console.log(`Server process exited with code ${code}`);
    serverProcess = null;
  });

  res.json({ status: "success", message: "Server started" });
});

// Start client processes
app.post("/start_clients", (req, res) => {
  const { num_clients } = req.body;

  if (!num_clients || num_clients <= 0) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid number of clients" });
  }

  if (clientProcesses.length > 0) {
    return res
      .status(400)
      .json({ status: "error", message: "Clients already running" });
  }

  for (let clientId = 1; clientId <= num_clients; clientId++) {
    const clientProcess = spawn(
      "python",
      ["framework/client.py", `--client_id=${clientId}`],
      { shell: true }
    );

    // Stream client logs
    streamLogs(clientProcess, `client_${clientId}_log`);

    clientProcess.on("close", (code) => {
      console.log(`Client ${clientId} process exited with code ${code}`);
    });

    clientProcesses.push(clientProcess);
  }

  res.json({ status: "success", message: `${num_clients} clients started` });
});

// Stop all processes
app.post("/stop_all", (req, res) => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }

  clientProcesses.forEach((process) => process.kill());
  clientProcesses = [];

  res.json({ status: "success", message: "All processes stopped" });
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("Client connected");
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
