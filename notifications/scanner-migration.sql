-- Credentials and anonymous usage only. Never store ticket content here.
CREATE TABLE IF NOT EXISTS scanner_devices(token_hash TEXT PRIMARY KEY,updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS scanner_usage(day TEXT NOT NULL,scope TEXT NOT NULL,count INTEGER NOT NULL DEFAULT 0,last_at INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(day,scope));
