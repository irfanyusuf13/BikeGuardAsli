CREATE TABLE Account (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL
);
