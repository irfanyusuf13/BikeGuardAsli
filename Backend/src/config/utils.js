exports.BaseApiResponse = (message, data) => ({
    message: message,
    data: data
});

exports.UserResponse = (userData) => ({
    id: userData.id,
    username: userData.username,
    email: userData.email,
    role: userData.role,
    isActive: userData.is_active
});

exports.AdminResponse = (adminData) => ({
    id: adminData.id,
    username: adminData.username,
    email: adminData.email,
    role: 'admin',
    permissions: adminData.permissions
});

exports.QRCodeResponse = (qrData) => ({
    code: qrData.code,
    isValid: qrData.is_valid,
    expirationDate: qrData.expiration_date
});

exports.ParkingSlotResponse = (slotData) => ({
    id: slotData.id,
    location: slotData.location,
    isOccupied: slotData.is_occupied,
    reservedBy: slotData.reserved_by
});

exports.BicycleResponse = (bikeData) => ({
    id: bikeData.id,
    owner: {
        id: bikeData.owner_id,
        name: bikeData.owner_name
    },
    isLocked: bikeData.is_locked,
    parkingSlotId: bikeData.parking_slot_id
});

exports.MonitoringSystemResponse = (monitorData) => ({
    systemStatus: monitorData.status,
    activeSlots: monitorData.active_slots,
    availableSlots: monitorData.available_slots,
    recentActivity: monitorData.recent_activity
});
