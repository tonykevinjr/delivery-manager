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

## Release 0.4.2 — batch additions and end-shift recovery

Add orders from an expanded current batch or Add delivery → Add to batch. Only one unfinished batch can be created per shift. Added stops persist as pending with the existing batch ID. For a departed batch, Mark ready appends the stop to the active run and records the change; existing Maps navigation is not silently modified. Batch View stops/Collapse is a dark green button anchored at top right on mobile.

Delete all saved customers uses an explicit irreversible confirmation, redacts linked contact snapshots/audit copies, and preserves shift totals. The confirmation warns that current order contacts are also redacted. No customer deletion is performed during upgrades.

End Shift now allows completed open runs, clearly states that saving confirms the return trip, and closes those runs at the shift end timestamp. Unfinished stops and incomplete run references still block finalization. No automatic return timestamp is inferred from the last drop-off. Report dates use bounded native-input wrappers to prevent iOS intrinsic sizing from exceeding their container. Browser measurements show equal field boundaries; actual iPhone rendering remains user verification.

Fifteen tests pass, including end-shift state, append membership and privacy deletion. Browser checked both Add to batch entry points, saved appended stop, Delete all confirmation/cancel (no contacts deleted), and date wrapper bounds.

## Release 0.4.3 — delivery choice styling, new bag icon, and cold-item checks

Delivery choices are Single Delivery and Batch Delivery (dark green), followed by Add to Existing Batch (gray). New batches can be prepared while another exists, but only one run can depart at a time. If several unfinished batches exist, Add to Existing Batch asks which one to use. The vector bag redraw follows the user's original side gusset and two-handle sketch; the original PNG is not included in the repository.

Single orders, batch stops and appended orders capture Drinks or Ice Cream? Yes/No. Flagged orders must confirm inclusion through a required checkbox before the customer message composer is shown. Both Delivered and Message go through this gate; confirmation is timestamped locally, and Undo clears it. No actual SMS is sent by the app. Updating an order's cold-item flag invalidates its previous confirmation.

History correction reasons are required and trimmed, including rejection of whitespace-only text. Cancel stays an ordinary button and does not validate or persist the form. Seventeen automated tests pass. Browser verified option order/enabled state, cold-item gate rejecting unchecked confirmation, unlocking message preparation after checking, rejecting whitespace correction reason, and canceling back to unchanged History.

## Release 0.4.4 — custom cold-item notes and Maps start location

Redrew the Settings cog as a symmetric eight-tooth vector. Selecting Yes for Drinks or Ice Cream reveals a required item-details field; notes persist per delivery and appear escaped, with line breaks, in the required confirmation. Editing item notes invalidates any prior confirmation.

Batch Maps URLs now omit the explicit restaurant source so Maps uses current location, with driving mode, ordered waypoints and the restaurant return unchanged. The earlier explicit source may have caused Steps/preview behavior; this is a hypothesis requiring target-device testing. Added a clearly labeled first-stop-only fallback; it is not the complete batch route. Apple documentation: https://developer.apple.com/documentation/mapkit/unified-map-urls

Home Screen PNGs have new filenames and both apple-touch-icon and manifest reference them. Existing installed iOS icons may remain cached; do not delete the installed app or clear its records to force an icon refresh. Back up before any manual reinstallation. This release does not claim to control iOS Home Screen icon refresh.

Sample-only migration seeds five completed deliveries and three returned runs into the current sample shift exactly once, creating a current shift if none exists. Existing sample entries and historical records are preserved, real records are untouched. Shift cards still represent current-shift activity, not lifetime totals.

Nineteen tests passed. Browser verified conditional notes, verbatim multiline reminder, symmetrical cog appearance, and nonzero sample Shift counters. Maps Go/Steps and Home Screen icon changes still require iPhone verification.

## Release 0.4.5 — editable addresses and inspectable route handoff

Edit address is available for pending, ready, active and completed orders, including historical run details. Corrections are audited and preserve stage, completion time, customer record and batch/run membership. Current batch groups include Review / reopen remaining route, with fully qualified text and independent single-stop navigation links. Existing Maps sessions are never silently replaced.

Route handoff now fully qualifies Seattle addresses with United States and percent-encodes spaces. If the final delivery address exactly matches the configured restaurant after punctuation/case normalization, it is used once as the final destination rather than duplicated as a waypoint and restaurant return. This addresses a concrete ambiguity in the reported test, but does not prove a root cause for Apple's selection of another restaurant. Single-stop and batch text-address resolution still need iPhone comparison; exact coordinates/place identifiers would require a separately verified location source.

Settings includes backup-first Home Screen icon refresh guidance: save a full backup in Files; add the current Safari page as another Home Screen web app while retaining the old icon; verify the new icon and records, restoring the backup if the new app has empty storage. Do not clear Safari website data, and do not delete the old app before backup/restoration is verified. iOS owns existing installed icon refresh.

Twenty-one tests pass, including duplicate restaurant waypoint elimination and address corrections at every stage. Browser verified editing a completed batch address preserved completion time/status and remaining-route review excluded that completed stop. Apple Maps route resolution and existing Home Screen icon remain on-device validation.

## Release 0.4.6 — single reports and mileage consistency

Report detail tabs are Scheduled, Single, Batch. Single filters saved single runs, including legacy one-stop runs without a kind field, within the selected shift date range; pagination remains ten per page.

End-shift save now rejects changed odometer mileage when the shift has zero completed deliveries. Canceled/pending/ready orders and completed deliveries from other shifts do not satisfy the check. Unchanged odometer with zero deliveries remains valid. Both start and end readings can be corrected in the end dialog; start changes are audited. History edits use the same guard, with no overwrite of existing records on upgrade. This is the user's requested consistency rule, not an assertion that all real-world driving requires a delivery.

Twenty-three tests passed, including zero-delivery mileage guard and Single/legacy run filtering. Browser verified tab order, Single records and pagination. Saved state remains unchanged on validation failure.

## Release 0.4.7 — explicit required item choices and alcohol receipts

New orders require explicit Yes/No for Drinks or Ice Cream and Alcohol, with neither preselected. Existing explicit answers are retained when editing; legacy missing alcohol flags require an answer upon edit. Both native form validation and domain checks reject unanswered/invalid values for singles, batch stops and appended orders. Drinks Yes still requires item notes and confirmation before customer text preparation. Alcohol Yes shows the requested receipt/signature reminder immediately, on the order card, at run preparation and at Delivered confirmation. This is a reminder, not a signature-capture or compliance-verification feature.

Customer placeholder is now Enter customer name. Twenty-four automated tests pass. Browser verified save blocked for unanswered questions and the alcohol reminder persisted on the saved order.

Multiple drivers can use the same hosted URL on separate phones: IndexedDB, settings, customer records and backups are local per browser/device, without app accounts or automatic cross-device dispatch/sync. A separate repository is not needed for independent records; no Charlotte repository or shared database was created.

## Release 0.4.8 — History spacing and two-step shift deletion

A delivery is one customer's order. A run is one departure from and return to the restaurant, containing a single delivery or a batch. History now explains this distinction.

Run-detail Edit address is a borderless block above the delivery timestamp with ten pixels of separation. A restrained green focus outline remains for keyboard accessibility instead of the previous brown one.

History → Edit → Delete shift opens two separate confirmation dialogs, each naming the shift and allowing Cancel. Delete is an ordinary button independent of correction-reason validation. The second confirmation alone performs transactional deletion of the completed shift, its delivery and run records, and related audit snapshots. Saved customers and all other shifts remain. A minimal deletion event records the deleted ID/time without retaining the removed snapshots. Reports and exports derive from remaining records. Active/missing shifts cannot be deleted by this function. Existing backups are unchanged, and there is no in-app undo; backup restoration is the recovery path.

Twenty-six automated tests passed. Browser checked first-warning cancel, second-warning cancel, unchanged History row count, and measured Edit address as zero border with a ten-pixel gap above timestamp. No browser records were deleted while testing; cascade deletion was verified with synthetic unit-test state.

## Release 0.4.9 — History multi-select, export dates and driver help

History supports select-all/individual selection and Delete selected with two distinct warnings listing each selected shift. All IDs are validated before deletion, and customers/unselected shifts are retained. Single-shift deletion is still available. Edit labels explicitly say Starting/Ending odometer (miles).

Active runs (including their grouped batch stops) sort before newly entered pending orders. Expanded batches offer Plan / reorder stops; arrows save a manual order before navigation, preserving run membership and status. A geographic map preview is explicitly not connected: Apple MapKit JS geocoding/map display would require an authorized Maps token/provider setup. This UI is not a map or automatic route optimization.

CSV now uses the visible From/Through dates directly, even without Apply. An empty range shows a message rather than downloading a header-only file. Successful exports announce count/date range and include CRLF record terminators. Actual browser-exported sample CSV for November 2–16, 2026 was parsed and verified: six completed shifts, twenty columns, every date in range. This fixes the old date-application mismatch; the user's exact original Numbers file was not inspected.

Shared defaults provide the restaurant address and the owner-confirmed Mike/Tony contacts in config.js. These are public source values, not secrets. Missing defaults are filled without overwriting customized values. The previously mistaken Mike number is corrected once to the newly supplied report number. Help is last in Settings with a popup offering Text Tony (usually quick response) and Call Tony — urgent. It launches sms:/tel: only; no message or call was made during tests. Contact settings remain editable.

Thirty-one tests pass. Browser checked bulk warning sequence and cancel/no row loss, direct date export/download contents, empty-range handling, manual planner, and correct Help link destinations. No user records were deleted during UI checks. No geographic API account was created.
