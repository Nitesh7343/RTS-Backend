const express = require('express');
const Bus = require('../models/Bus');
const router = express.Router();

// Get live bus details
router.get('/bus/:busId', async (req, res) => {
  try {
    const bus = await Bus.findOne({ busId: req.params.busId })
      .populate('activeDriverId', 'name email phone'); // show driver info

    if (!bus) return res.status(404).json({ error: "Bus not found" });

    res.json({
      busId: bus.busId,
      location: bus.currentLocation,
      lastUpdated: bus.lastUpdated,
      driver: bus.activeDriverId ? {
        name: bus.activeDriverId.name,
        email: bus.activeDriverId.email
      } : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
