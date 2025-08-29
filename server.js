require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

  // Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const driverRoutes = require('./routes/driver');
app.use('/api/driver', driverRoutes);

const passengerRoutes = require('./routes/passenger');
app.use('/api/passenger', passengerRoutes);




// Simple test route
app.get('/api/health', (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
