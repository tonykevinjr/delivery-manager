# Delivery Manager

First local PWA build, following PROJECT_SPEC.md. No dependencies or paid services are required.

## Run

From this folder: `npm run dev`. Open http://localhost:5173 on this Mac. Keep this origin consistent: localhost and 127.0.0.1 have different local databases. Stop with Control-C.

## Verify

`npm test` runs critical domain checks using Node's built-in test runner. JavaScript can be checked with `node --check dist/app.js`.

## Current behavior

Four main tabs plus Settings; folded-top bag icon; IndexedDB shifts, deliveries and customers; explicit customer retention; manual ordered runs with Apple Maps links; Delivered/Undo; clipboard + recipient SMS composition; odometer mileage, private rate snapshots; History mileage corrections; date-range CSV; full JSON backup/replace restore; offline app shell.

## Validation completed

- Five domain tests: arithmetic, Mike's report allowlist, Maps stop ordering, CSV escaping, backup validation.
- Local HTTP 200 and browser render.
- Browser test: start at 100, reload/resume, end at 110.5, verify History shows 10.5 miles.
- A synthetic zero-delivery shift from that browser test remains in this local preview. It is not a real payroll record.

## Release limitations and next work

This is not ready for payroll reliance. Routing is manual, without driving estimates or automatic schedule optimization. No service has been chosen. Target iPhone Maps, Messages, installed storage and backup roundtrip remain to test. Native XLSX, original order timestamps, scheduled-arrival policy, searchable History, visible correction log, historical delivery drilldown, persistent-storage request, PNG Home Screen icons and polished update handling remain. Backup validation currently covers core record shape and relationships; harden all imported nested values before production use. Use one browser tab at a time until concurrency protection is added. Private records never leave through app analytics; there are no analytics or remote assets. Maps and Messages are explicit handoffs.

## Handoff

Source is in dist/ with no build step. PROJECT_SPEC.md is the product reference. DECISIONS.md records the first milestone and unresolved service choices. Hosting has not been configured; localhost on this Mac is not an iPhone-installable URL. Choose stable HTTPS hosting and test on the target device before real use. Do not commit private backups or customer records.
