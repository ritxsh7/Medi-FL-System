const express = require("express");
const {
  startClientProcesses,
  stopAllProcesses,
} = require("../utils/processes.js");
const Session = require("../schemas/Session.js");

const router = express.Router();

// Start client processes
router.post("/start_clients/:id", async (req, res) => {
  const { id } = req.params;

  console.log("clients started");

  const session = await Session.findById(id)
    .populate("createdBy", "_id")
    .populate("clients", "_id accessId");

  // console.log(session);

  const num_clients = session.numClients;

  if (!num_clients || num_clients <= 0) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid number of clients" });
  }

  dataDirs = session.dataDirs;
  aggregator = session.aggregationAlgorithm;

  // [
  //   "D:/federated learning/fed-impl/distributed/client1",
  //   "D:/federated learning/fed-impl/distributed/client2",
  // ];

  clients = session.clients.map((client, i) => {
    return { _id: client._id, dir: dataDirs[i] };
  });

  console.log(clients);

  try {
    if (startClientProcesses(clients, aggregator)) {
      session.status = "in-progress";
      await session.save();
      return res.status(200).json({
        message: "Clients started successfully",
        session,
      });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong while starting the clients" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
    stopAllProcesses();
  }
});

// Save client metrics
router.post("/saveperformamce/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { performance } = req.body;

    const newSession = await Session.findByIdAndUpdate(
      id,
      {
        $push: { clientPerformance: performance },
      },
      { new: true }
    );

    return res.status(200).json({ newSession, message: "Model updated" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error while saving model" });
  }
});

module.exports = router;
