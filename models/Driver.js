const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  passwordHash: String,
  busId: { type: String, default: null },
  isOnDuty: { type: Boolean, default: false },
  fcmToken: String,
  lastActiveAt: Date
});

module.exports = mongoose.model('Driver', DriverSchema);
