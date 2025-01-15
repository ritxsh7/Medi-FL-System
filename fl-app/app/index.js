const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const { initialize } = require("./utils/processes.js");

// Custom modules
const connection = require("./config/db.js");
const serverRoutes = require("./routes/serverRoutes.js");
const clientRoutes = require("./routes/clientRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

dotenv.config();

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

// Routes
app.use("/auth", authRoutes);
app.use("/server", serverRoutes);
app.use("/client", clientRoutes);

// Database connection
connection(process.env.MONGODB_URI);

server.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
