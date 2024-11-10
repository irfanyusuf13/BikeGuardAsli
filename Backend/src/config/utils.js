exports.BaseApiResponse = (message, data) => ({
    message: message,
    data: data
});

// Respon untuk User
exports.UserResponse = (userData) => ({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role, // Misalnya: user atau admin
    qrCodes: userData.qrCodes, // ID QR code yang dimiliki oleh pengguna
    bicycles: userData.bicycles // ID sepeda yang dimiliki oleh pengguna
});

// Respon untuk Admin
exports.AdminResponse = (adminData) => ({
    id: adminData.id,
    name: adminData.name,
    email: adminData.email,
    role: 'admin',
    permissions: adminData.permissions // Hak akses admin
});

// Respon untuk QR Code
exports.QRCodeResponse = (qrData) => {
    return {
        id: qrData.id,
        code: qrData.code,
        expiration_date: qrData.expiration_date,
        associated_parking_slot: qrData.associated_parking_slot
    };
};

// Respon untuk Slot Parkir
exports.ParkingSlotResponse = (slotData) => ({
    id: slotData.id,
    location: slotData.location,
    isOccupied: slotData.isOccupied,
    reservedBy: slotData.reservedBy, // ID pengguna yang memesan slot
    bicycles: slotData.bicycles // ID sepeda yang terparkir di slot ini
});

// Respon untuk Sepeda
exports.BicycleResponse = (bikeData) => ({
    id: bikeData.id,
    owner: {
        id: bikeData.owner_id,
        name: bikeData.owner_name
    },
    isLocked: bikeData.isLocked,
    parkingSlotId: bikeData.parking_slot_id, // ID slot parkir saat ini
    qrCode: bikeData.qrCode // ID QR code terkait sepeda
});

// Respon untuk Sistem Monitoring
exports.MonitoringSystemResponse = (monitorData) => ({
    systemStatus: monitorData.status,
    activeSlots: monitorData.activeSlots,
    availableSlots: monitorData.availableSlots,
    recentActivity: monitorData.recentActivity // Aktivitas terkini dalam sistem
});