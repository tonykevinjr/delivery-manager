CREATE TABLE IF NOT EXISTS devices (
 id TEXT PRIMARY KEY,
 token_hash TEXT NOT NULL UNIQUE,
 subscription TEXT NOT NULL,
 revision INTEGER NOT NULL DEFAULT 0,
 due_at INTEGER,
 expires_at INTEGER,
 attempts INTEGER NOT NULL DEFAULT 0,
 last_test INTEGER NOT NULL DEFAULT 0,
 updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS devices_due ON devices(due_at);
