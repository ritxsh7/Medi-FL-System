const express = require("express");
const { startClientProcesses } = require("../utils/processes.js");

const router = express.Router();

// Start client processes
router.post("/start_clients", (req, res) => {
  const { num_clients } = req.body;

  if (!num_clients || num_clients <= 0) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid number of clients" });
  }

  try {
    startClientProcesses(num_clients, res);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
