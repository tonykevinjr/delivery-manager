CREATE TABLE IF NOT EXISTS oil_profiles(owner_hash TEXT PRIMARY KEY,cycle TEXT NOT NULL,last_changed REAL NOT NULL,due_mileage REAL NOT NULL,mileage REAL NOT NULL,revision INTEGER NOT NULL,enabled INTEGER NOT NULL DEFAULT 0,updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS oil_messages(owner_hash TEXT NOT NULL,cycle TEXT NOT NULL,stage TEXT NOT NULL,status TEXT NOT NULL,attempts INTEGER NOT NULL DEFAULT 0,due_at INTEGER NOT NULL,created_at INTEGER NOT NULL,first_attempt_at INTEGER,message_id TEXT,sent_at INTEGER,PRIMARY KEY(owner_hash,cycle,stage));

CREATE INDEX IF NOT EXISTS oil_messages_due ON oil_messages(status,due_at);
