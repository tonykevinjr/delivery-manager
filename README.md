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

## iPhone test release 0.3

Hosted app: https://tonykevinjr.github.io/delivery-manager/

Sample mode: https://tonykevinjr.github.io/delivery-manager/?demo=1

The sample database is separate from real records and creates three rolling months of fictional Wednesday/Thursday/Friday shifts. Exports are labeled SAMPLE, reports cannot be sent to Mike, and sample backups cannot replace real records. Return to the real app using the sample banner. No automatic real-data seeding occurs.

New delivery entry distinguishes Single Delivery from Batch Delivery. Batch stops are drafted sequentially and saved together, with batch IDs preserved across editing and route handoff. Unsaved batch drafts last for the current session only. Ready groups stay separate when preparing runs. History → Runs shows single/batch classification and recorded stop details. Legacy runs infer type from their recorded stop count.

Scheduled cards use the selected-tab green and a clock icon. Delivered asks the exact Yes/Cancel question before saving. The message composer closes with Done. Numeric/telephone input hints are set for iPhone keyboards; date inputs are constrained and left-aligned. Local address suggestions match stored addresses; a live street-search provider has not been configured.

Nine domain tests pass, including sample record links, day-of-week/date boundaries, run types, and timing. Browser checks cover two-stop batch creation, scheduled selection, cancel-without-completion, Yes completion, Done, and populated annual reports. Actual iPhone keyboard/layout checks remain with the user.

## Release 0.4 — preparation stages and compact delivery views

New tickets start Pending. Mark ready when bagged, then Start delivery/batch to save an active run before navigation. Scheduled arrival never activates a ticket automatically. All pending batch stops must be marked ready before departure. Existing ready/active/completed records retain their status; pending records are supported in backups.

Deliveries sorts ongoing items newest-first above a separate completed section. Batch stops appear inside one collapsible group; a partly completed batch remains in ongoing until all stops are completed. Standard completed badges are gray, scheduled ones remain green. Ticket fields request numeric keyboards, saved-customer suggestions have stronger contrast, and the local-storage explanation appears in Settings instead of a global save-status badge. Completion and route-saved popups use Done.

Reports has Scheduled and Batch detail filters, newest-first with ten items per page and Previous/Next controls. Date-range totals and CSV exports remain complete rather than paginated. Eleven automated checks passed, plus browser checks for a new pending single order, ready/start/completion transitions, batch expand/collapse and report filters/paging. iPhone keyboard/spacing appearance remains for on-device user review.

## Release 0.4.1 — update recovery

Versioned CSS/module URLs prevent mixed releases. The service worker downloads with HTTP-cache revalidation, activates after a successful full download, and claims clients without forcing open forms to reload. Online app fetches bypass the browser HTTP cache; offline fallback retains old caches for open older pages. IndexedDB is never cleared. Settings → Check for updates fetches uncached release metadata and offers an explicit reload if newer. Service-worker checks run on launch and returning to the foreground. Twelve automated checks pass, including uncached version checks and offline/error handling; browser verified version display, update button, and unchanged saved sample records. Target iPhone adoption still needs user confirmation.
