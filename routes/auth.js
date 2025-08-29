const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');

// ✅ Register Driver
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // check if already exists
    const existing = await Driver.findOne({ phone });
    if (existing) return res.status(400).json({ error: "Driver already exists" });

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // create driver
    const driver = await Driver.create({
      name,
      phone,
      passwordHash,
    });

    res.json({ message: "Driver registered successfully", driverId: driver._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login Driver
router.post('/login', async (req, res) => {
  try {
    const { phone, password, fcmToken } = req.body;

    const driver = await Driver.findOne({ phone });
    if (!driver) return res.status(400).json({ error: "Driver not found" });

    const isMatch = await bcrypt.compare(password, driver.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // save FCM token if provided
    if (fcmToken) {
      driver.fcmToken = fcmToken;
      await driver.save();
    }

    const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET, { expiresIn: '2d' });

    res.json({
      message: "Login successful",
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        phone: driver.phone,
        busId: driver.busId,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
