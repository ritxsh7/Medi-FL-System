const express = require("express");
const axios = require("axios");
const {
  startServerProcess,
  stopAllProcesses,
} = require("../utils/processes.js");
const Session = require("../schemas/Session.js");
const { default: mongoose } = require("mongoose");

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

    if (session.clients.includes(clientId)) {
      return res
        .status(404)
        .json({ message: "Client already joined the session" });
    }

    session.clients.push(new mongoose.Types.ObjectId(clientId));
    await session.save();
    ioInstance.emit("client_joined");

    return res
      .status(200)
      .json({ message: "Session initiated. Id: " + session._id });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while joining the client" });
  }
});

// Provide dataset
router.post("/submit-data", async (req, res) => {
  const { sessionId, dataPath, accessId } = req.body;
  console.log(sessionId, dataPath);

  try {
    var result = await axios.post("http://localhost:5555/visualize-data", {
      dataset_path: `${dataPath}\\train`,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json("Error while processing dataset");
  }

  if (!isSessionStarted)
    return res
      .status(300)
      .json({ message: "Aggregation server not started yet" });

  try {
    const session = await Session.findById(sessionId);

    if (!session.dataDirs) {
      session.dataDirs = [];
    }

    if (!session.classCounts) {
      session.classCounts = [];
    }

    session.classCounts.push({
      clientId: accessId,
      data: result.data.class_counts,
    });

    session.dataDirs.push(dataPath);
    await session.save();
    return res.status(200).json({
      message: "Dataset found",
    });
  } catch (err) {
    console.log(err);
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

// Save the session model
router.put("/save-model/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { session } = req.body;
    // console.log(session.structuredLogs);

    let sessionById = await Session.findByIdAndUpdate(id, {
      logs: session.structuredLogs,
    });

    return res.status(200).json({ sessionById, message: "Saved successfully" });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ message: "Something went wrong while fetching session" });
  }
});

// Start the server process
router.post("/start_server/:id", async (req, res) => {
  const { id } = req.params;
  try {
    isSessionStarted = true;

    const session = await Session.findById(id)
      .populate("createdBy", "_id")
      .populate("clients", "_id accessId");

    if (
      startServerProcess(id, session.numRounds, session.aggregationAlgorithm)
    ) {
      session.status = "listening";
      await session.save();
      return res.json({
        status: "success",
        message: "Server started",
        session,
      });
    }

    return res
      .status(500)
      .json({ message: "Something went wrong while starting the server" });
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
