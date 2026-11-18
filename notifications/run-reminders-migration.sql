-- Additive migration: keeps existing device enrollments and EOS reminders.
ALTER TABLE devices ADD COLUMN run_revision INTEGER NOT NULL DEFAULT 0;
ALTER TABLE devices ADD COLUMN run_completed_at INTEGER;
ALTER TABLE devices ADD COLUMN run_due_at INTEGER;
ALTER TABLE devices ADD COLUMN run_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE devices ADD COLUMN run_attempts INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS devices_run_due ON devices(run_due_at);
