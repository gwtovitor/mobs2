CREATE SCHEMA IF NOT EXISTS ccca;

CREATE TABLE ccca.account (
    account_id UUID PRIMARY KEY,
    name TEXT,
    email TEXT,
    password TEXT
);

-- CREATE TABLE ccca.account_asset (
--     account_id UUID,
--     asset_id text,
--     quantity numeric,
--     PRIMARY KEY (account_id, asset_id)
-- );

