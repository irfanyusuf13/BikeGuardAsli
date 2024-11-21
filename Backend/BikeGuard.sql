-- 1. Buat tipe ENUM untuk role
CREATE TYPE role_type AS ENUM ('user', 'admin');

-- 2. Tabel users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role role_type
);

-- 3. Tabel parking_slots
CREATE TABLE parking_slots (
    id SERIAL PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    is_occupied BOOLEAN DEFAULT false,
    reserved_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- 4. Tabel qrcodes
CREATE TABLE qrcodes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    is_valid BOOLEAN DEFAULT true,
    expiration_date TIMESTAMP,
    associated_parking_slot INTEGER REFERENCES parking_slots(id) ON DELETE SET NULL
);

-- 5. Tabel monitoring_system
CREATE TABLE monitoring_system (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    active_slots INTEGER DEFAULT 0,
    available_slots INTEGER DEFAULT 0,
    recent_activity TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    parking_slot_id INTEGER REFERENCES parking_slots(id) ON DELETE SET NULL
);
