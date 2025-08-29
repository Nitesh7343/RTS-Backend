const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Bus = require('../models/Bus');
const auth = require('../utils/authMiddleware');

// ✅ Start Duty
router.post('/start', auth, async (req, res) => {
  try {
    const { busId } = req.body;
    const driver = await Driver.findById(req.user.id);

    if (!driver) return res.status(404).json({ error: "Driver not found" });

    driver.busId = busId;
    driver.isOnDuty = true;
    driver.lastActiveAt = new Date();
    await driver.save();

    await Bus.findOneAndUpdate(
      { busId },
      { activeDriverId: driver._id },
      { new: true, upsert: true }
    );

    res.json({ message: "Duty started", busId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Stop Duty
router.post('/stop', auth, async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);
    if (!driver) return res.status(404).json({ error: "Driver not found" });

    driver.isOnDuty = false;
    await driver.save();

    await Bus.findOneAndUpdate(
      { busId: driver.busId },
      { activeDriverId: null }
    );

    res.json({ message: "Duty stopped" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Location
router.post('/update-location', auth, async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ error: "Latitude and Longitude must be numbers" });
    }

    const driver = await Driver.findById(req.user.id);

    if (!driver || !driver.isOnDuty) {
      return res.status(400).json({ error: "Driver not on duty" });
    }

    const bus = await Bus.findOneAndUpdate(
      { busId: driver.busId },
      {
        currentLocation: { type: "Point", coordinates: [lng, lat] },
        lastUpdated: new Date()
      },
      { new: true }
    );

    driver.lastActiveAt = new Date();
    await driver.save();

    res.json({ message: "Location updated", bus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
