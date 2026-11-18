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
