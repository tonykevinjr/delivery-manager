CREATE TABLE IF NOT EXISTS dispatch_pairs(id TEXT PRIMARY KEY,owner_hash TEXT NOT NULL,driver_hash TEXT NOT NULL UNIQUE,manager_hash TEXT NOT NULL UNIQUE,push_hash TEXT,mode TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS dispatch_packets(id TEXT PRIMARY KEY,pair_id TEXT NOT NULL,ciphertext TEXT,iv TEXT,created_at INTEGER NOT NULL,expires_at INTEGER NOT NULL,received_at INTEGER,push_due INTEGER,push_attempts INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS dispatch_inbox ON dispatch_packets(pair_id,created_at);
CREATE INDEX IF NOT EXISTS dispatch_push ON dispatch_packets(push_due);
