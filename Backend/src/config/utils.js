// Utility untuk format respons API dasar
exports.BaseApiResponse = (message, data) => ({
    message: message,
    data: data,
});

// Respons untuk User
exports.UserResponse = (userData) => ({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role, // Role user: 'user' atau 'admin'
    qrCodes: userData.qrCodes || [], // QR codes milik user
});

// Respons untuk Admin
exports.AdminResponse = (adminData) => ({
    id: adminData.id,
    name: adminData.name,
    email: adminData.email,
    role: 'admin',
    permissions: adminData.permissions || [], // Hak akses admin
});

// Respons untuk QR Code
exports.QRCodeResponse = (qrData) => ({
    id: qrData.id,
    code: qrData.code,
    isValid: qrData.isValid, // Status validitas QR code
    expirationDate: qrData.expiration_date,
    associatedParkingSlot: qrData.associated_parking_slot, // ID slot parkir yang terkait
});

// Respons untuk Slot Parkir
exports.ParkingSlotResponse = (slotData) => ({
    id: slotData.id,
    location: slotData.location,
    isOccupied: slotData.isOccupied,
    reservedBy: slotData.reservedBy, // ID pengguna yang memesan slot
});

// Respons untuk Sistem Monitoring
exports.MonitoringSystemResponse = (monitorData) => ({
    id: monitorData.id, // ID sistem monitoring
    systemStatus: monitorData.status, // Status sistem (contoh: aktif/nonaktif)
    activeSlots: monitorData.activeSlots, // Jumlah slot aktif
    availableSlots: monitorData.availableSlots, // Jumlah slot tersedia
    recentActivity: monitorData.recentActivity || "", // Aktivitas terkini
});
