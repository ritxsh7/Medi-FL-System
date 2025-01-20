const express = require("express");
const {
  startClientProcesses,
  stopAllProcesses,
} = require("../utils/processes.js");
const Session = require("../schemas/Session.js");

const router = express.Router();

// Start client processes
router.post("/start_clients/:id", async (req, res) => {
  let { clients } = req.body;
  const { id } = req.params;

  const session = await Session.findById(id)
    .populate("createdBy", "_id")
    .populate("clients", "_id accessId");

  const num_clients = session.numClients;

  if (!num_clients || num_clients <= 0) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid number of clients" });
  }

  dataDirs = [
    "D:/federated learning/fed-impl/distributed/client1",
    "D:/federated learning/fed-impl/distributed/client2",
  ];

  clients = clients.map((client, i) => {
    return { ...client, dir: dataDirs[i] };
  });

  try {
    if (startClientProcesses(clients)) {
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

module.exports = router;
