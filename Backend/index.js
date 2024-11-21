const express = require('express');
const cors = require("cors");
const pool = require('./src/config/database');
require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Import routes

const AdminRoutes = require('./src/routes/adminRoutes');
const ParkingSlotRoutes = require('./src/routes/parkingSlotRoutes');
const QrCodeRoutes = require('./src/routes/qrCodeRoutes');
const UserRoutes = require('./src/routes/userRoutes');
const MonitorRoutes = require('./src/routes/monitoringSystemRoutes');

// Use routes

app.use('/user', UserRoutes);
app.use('/admin', AdminRoutes);
app.use('/parking-slot', ParkingSlotRoutes);
app.use('/qr-code', QrCodeRoutes);
app.use('/monitor', MonitorRoutes);

pool.connect().then(() => {
    console.log('Connected to the NeonDB');
}).catch(error => {
    console.error('Connection error', error);
});

app.listen(port, () => {
  console.log("Server is running and listening on port", port);
});

