const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  numClients: {
    type: Number,
    required: true,
  },
  clients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entity",
    },
  ],
  model: {
    type: String,
    required: true,
    default: "YOLOv8",
  },
  aggregationAlgorithm: {
    type: String,
    enum: ["WIFA", "FedAvg", "FedProx", "FedNova"],
    default: "WIFA",
  },
  metrics: {
    localAverage: {
      type: Number,
    },
    globalAverage: {
      type: Number,
    },
  },
  status: {
    type: String,
    enum: ["pending", "listening", "in-progress", "completed"],
    default: "pending",
  },
  numRounds: {
    type: Number,
    default: 3,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Entity",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Session", SessionSchema);
