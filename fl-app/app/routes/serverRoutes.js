const express = require("express");
const {
  startServerProcess,
  stopAllProcesses,
} = require("../utils/processes.js");
const Session = require("../schemas/Session.js");

const router = express.Router();
let ioInstance;

const initializeServerIO = (io) => {
  ioInstance = io;
};

let isSessionStarted = false;

// Create session for admin
router.post("/create-session", async (req, res) => {
  try {
    const {
      name,
      numClients,
      adminId,
      numRounds,
      aggregationAlgorithm,
      model,
    } = req.body;

    const newSession = new Session({
      name,
      numClients,
      createdBy: adminId,
      numRounds,
      aggregationAlgorithm,
      model,
    });

    const savedSession = await newSession.save();

    return res
      .status(201)
      .json({ message: "Session created successfully", session: savedSession });
  } catch (error) {
    console.error("Error creating session:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the session" });
  }
});

// Join session for client
router.post("/join-session", async (req, res) => {
  const { sessionId, clientId } = req.body;

  if (!isSessionStarted)
    return res
      .status(300)
      .json({ message: "Aggregation server not started yet" });

  try {
    const session = await Session.findById(sessionId);

    if (!session)
      return res.status(404).json({ message: "No such session exists" });

    session.clients.push(clientId);
    await session.save();
    ioInstance.emit("client_joined");
    return res
      .status(200)
      .json({ message: "Session joined, session ID: " + session._id });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while joining the client" });
  }
});

// Get session details
router.get("/session/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
      .populate("clients", "_id accessId")
      .populate("createdBy", "_id accessId");
    return res.status(200).json({ session });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong while fetching session" });
  }
});

// Start the server process
router.post("/start_server", (req, res) => {
  try {
    isSessionStarted = true;
    startServerProcess(res);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
    stopAllProcesses();
  }
});

// Stop all processes
router.post("/stop_all", (req, res) => {
  try {
    stopAllProcesses();
    res.json({ status: "success", message: "All processes stopped" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = { serverRoutes: router, initializeServerIO };
