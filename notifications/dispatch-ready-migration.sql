-- Availability is operational metadata only; customer details remain encrypted.
ALTER TABLE dispatch_pairs ADD COLUMN driver_available INTEGER NOT NULL DEFAULT 0;
ALTER TABLE dispatch_pairs ADD COLUMN availability_at INTEGER;
ALTER TABLE dispatch_packets ADD COLUMN notice TEXT;
