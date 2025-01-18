const express = require("express");
const {
  startClientProcesses,
  stopAllProcesses,
} = require("../utils/processes.js");

const router = express.Router();

// Start client processes
router.post("/start_clients", async (req, res) => {
  const { num_clients, clients } = req.body;

  if (!num_clients || num_clients <= 0) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid number of clients" });
  }

  try {
    startClientProcesses(clients, res);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
    stopAllProcesses();
  }
});

module.exports = router;
