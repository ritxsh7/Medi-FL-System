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
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
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
