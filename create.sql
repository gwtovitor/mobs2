CREATE SCHEMA IF NOT EXISTS mobs;

CREATE TABLE IF NOT EXISTS mobs.account (
    account_id UUID PRIMARY KEY,
    name       TEXT,
    email      TEXT,
    password   TEXT
);

CREATE TABLE IF NOT EXISTS mobs.vehicle (
  plate        TEXT PRIMARY KEY,
  model        TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  year         INTEGER NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT now(),
  updated_at   TIMESTAMP NOT NULL DEFAULT now()
);
