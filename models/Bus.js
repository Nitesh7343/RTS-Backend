const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  busId: { type: String, unique: true },
  routeName: String,
  routeStops: [
    {
      name: String,
      location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]  // [lng, lat]
      }
    }
  ],
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  lastUpdated: Date,
  activeDriverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null }
});

BusSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Bus', BusSchema);
