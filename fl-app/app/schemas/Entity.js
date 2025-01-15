const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const entitySchema = new mongoose.Schema({
  accessId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "client"], required: true },
});

entitySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Entity", entitySchema);
