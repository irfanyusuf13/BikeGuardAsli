CREATE TYPE role_type AS ENUM ('user', 'admin');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role role_type DEFAULT 'user'
);

CREATE TABLE parking_slots (
    id SERIAL PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    is_occupied BOOLEAN DEFAULT FALSE,
    reserved_by INT REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE qrcodes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    expiration_date TIMESTAMP,
    associated_parking_slot INT REFERENCES parking_slots(id) ON DELETE SET NULL
);

CREATE TABLE bicycles (
    id SERIAL PRIMARY KEY,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    is_locked BOOLEAN DEFAULT TRUE,
    parking_slot_id INT REFERENCES parking_slots(id) ON DELETE SET NULL,
    qr_code INT REFERENCES qrcodes(id) ON DELETE SET NULL
);

CREATE TABLE monitoring_system (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    active_slots INT DEFAULT 0,
    available_slots INT DEFAULT 0,
    recent_activity TEXT
);
