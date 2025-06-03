const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const Entity = require("../schemas/Entity");
const Session = require("../schemas/Session");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { accessId, password, role } = req.body;
    const entity = new Entity({ accessId, password, role });
    await entity.save();
    res.status(201).json({ message: "Entity registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering entity " + error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { accessId, password } = req.body;
    const entity = await Entity.findOne({ accessId });
    if (!entity)
      return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, entity.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: entity._id, role: entity.role, accessId: entity.accessId },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    res.status(200).json({
      token,
      id: entity._id,
      role: entity.role,
      accessId: entity.accessId,
      message: "Login success",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in, " + error.getMessage() });
  }
});

router.get("/sessions", async (req, res) => {
  const sessions = await Session.find({});
  // console.log(sessions);

  return res.status(200).json({
    sessions,
  });
});

module.exports = router;
