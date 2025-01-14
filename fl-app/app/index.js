const express = require("express");
const cors = require("cors");
const serverRoutes = require("./routes/serverRoutes.js");
const clientRoutes = require("./routes/clientRoutes.js");
const http = require("http");
const { Server } = require("socket.io");
const { initialize } = require("./utils/processes.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Initialize io
initialize(io);

io.on("connection", (_) => {
  console.log("Client connected");
});

// Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());
app.get("/", (_, res) => res.send("working"));
app.use("/server", serverRoutes);
app.use("/client", clientRoutes);

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
