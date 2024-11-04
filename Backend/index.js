const express = require('express');
const cors = require("cors");
const pool = require('./src/config/database');
require("dotenv").config();

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Import routes
app.get('/userProfile', services.getAllUserProfile);
app.post('/register', services.registerUser);
app.post('/login', services.loginUser);

const AdminRoutes = require('./src/routes/adminRoutes');
const BicycleRoutes = require('./src/routes/bicycleRoutes');
const ParkingSlotRoutes = require('./src/routes/parkingSlotRoutes');
const QrCodeRoutes = require('./src/routes/qrCodeRoutes');
const UserRoutes = require('./src/routes/userRoutes');

// Use routes
app.use('/admin', AdminRoutes);
app.use('/bicycle', BicycleRoutes);
app.use('/parkingslot', ParkingSlotRoutes);
app.use('/qrcode', QrCodeRoutes);
app.use('/user', UserRoutes);

pool.connect().then(() => {
    console.log('Connected to the NeonDB');
}).catch(error => {
    console.error('Connection error', error);
});

app.listen(port, () => {
  console.log("Server is running and listening on port", port);
});

