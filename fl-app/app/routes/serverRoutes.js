const express = require("express");
const {
  startServerProcess,
  stopAllProcesses,
} = require("../utils/processes.js");

const router = express.Router();

// Start the server process
router.post("/start_server", (req, res) => {
  try {
    startServerProcess(res);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
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

module.exports = router;
