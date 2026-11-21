CREATE TABLE IF NOT EXISTS devices (
 id TEXT PRIMARY KEY,
 token_hash TEXT NOT NULL UNIQUE,
 subscription TEXT NOT NULL,
 run_revision INTEGER NOT NULL DEFAULT 0,
 run_completed_at INTEGER,
 run_due_at INTEGER,
 run_count INTEGER NOT NULL DEFAULT 0,
 run_attempts INTEGER NOT NULL DEFAULT 0,
 revision INTEGER NOT NULL DEFAULT 0,
 due_at INTEGER,
 expires_at INTEGER,
 attempts INTEGER NOT NULL DEFAULT 0,
 last_test INTEGER NOT NULL DEFAULT 0,
 updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS devices_due ON devices(due_at);

CREATE INDEX IF NOT EXISTS devices_run_due ON devices(run_due_at);

-- Credentials and anonymous usage only. Never store ticket content here.
CREATE TABLE IF NOT EXISTS scanner_devices(token_hash TEXT PRIMARY KEY,updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS scanner_usage(day TEXT NOT NULL,scope TEXT NOT NULL,count INTEGER NOT NULL DEFAULT 0,last_at INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(day,scope));

CREATE TABLE IF NOT EXISTS oil_profiles(owner_hash TEXT PRIMARY KEY,cycle TEXT NOT NULL,last_changed REAL NOT NULL,due_mileage REAL NOT NULL,mileage REAL NOT NULL,revision INTEGER NOT NULL,enabled INTEGER NOT NULL DEFAULT 0,updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS oil_messages(owner_hash TEXT NOT NULL,cycle TEXT NOT NULL,stage TEXT NOT NULL,status TEXT NOT NULL,attempts INTEGER NOT NULL DEFAULT 0,due_at INTEGER NOT NULL,created_at INTEGER NOT NULL,first_attempt_at INTEGER,message_id TEXT,sent_at INTEGER,PRIMARY KEY(owner_hash,cycle,stage));

CREATE INDEX IF NOT EXISTS oil_messages_due ON oil_messages(status,due_at);
CREATE TABLE IF NOT EXISTS dispatch_pairs(id TEXT PRIMARY KEY,owner_hash TEXT NOT NULL,driver_hash TEXT NOT NULL UNIQUE,manager_hash TEXT NOT NULL UNIQUE,push_hash TEXT,mode TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS dispatch_packets(id TEXT PRIMARY KEY,pair_id TEXT NOT NULL,ciphertext TEXT,iv TEXT,created_at INTEGER NOT NULL,expires_at INTEGER NOT NULL,received_at INTEGER,push_due INTEGER,push_attempts INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS dispatch_inbox ON dispatch_packets(pair_id,created_at);
CREATE INDEX IF NOT EXISTS dispatch_push ON dispatch_packets(push_due);
