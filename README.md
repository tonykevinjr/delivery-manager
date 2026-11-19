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

## Release 0.4.10 — defaults visible in both real and sample Settings

Fixed sample initialization and migration: both modes now display the confirmed restaurant address and Mike contact. Known sample placeholder addresses and blank/whitespace fields are replaced, while genuine custom values remain. New sample databases use the shared defaults immediately. Use restaurant defaults in read-only Essentials explicitly restores just the restaurant address and Mike number without changing reimbursement, customers or shifts. Storage's config import is versioned with the rest of the release.

Thirty-three tests pass, including new/old sample settings and custom-value preservation. Browser verified Essentials shows the confirmed address, +12062508612 and the restore-defaults action.


## Version 0.5.0 — field-test workflow update

- Runs close automatically when all their deliveries are delivered/canceled, including orders appended while underway. New closure uses `completedAt`/`completionKind: last-delivery`; it never invents `returnedAt`. Existing historical return timestamps are retained. Completed older active runs are reconciled at launch.
- Existing single/batch/build-batch entry stays; batch route controls are side by side, separated from centered +Add order. Routes end at the last delivery, with optional separate restaurant directions. Singles skip stop ordering.
- Completed individual orders start collapsed and expand independently. Name keyboard uses word capitalization; phone precedes address and formats dashes. Optional Needs signature badge is automatic for alcohol.
- Barking-dog notes are stored by normalized address (including unit) and shown on future delivery cards, route previews and individual Navigate confirmation. No geofencing/background location.
- Tasks tab saves shift-specific patio, ice cream, Juice children, fruit children, syrup children and free-text special work. Only selected tasks are added to Mike’s report. End shift opens the report composer (sample mode never sends reports).
- In-app overdue reminder: Seattle Sun–Thu 21:00, Fri–Sat 21:30, 15-minute persisted snooze. Checks on foreground and every 30 seconds while open; does not interrupt an open dialog. No lock-screen push service.
- Scan ticket requests rear-camera capture using the native file picker; device controls flash/camera availability. Browser-local Tesseract.js 6.0.1, core 6.0.0 and English fast language data are hosted with the app; no third-party photo upload, no retained photos or OCR text. Scan fills name/phone/address/order number only, leaves item/schedule confirmations manual. Full-image recognition retries focused center-ticket recognition when key fields are missing. Review/correct every field. First scan downloads the engine; scanned assets cache for later offline use. Accuracy and camera/flash behavior need real iPhone field testing.
- Customer names and numbers remain stored as agreed. No customer deletion migration. New tasks/address warnings remain in JSON backups.

Validation: 38 automated checks, single-start/complete flow, reminder snooze, task child expansion/save, and 390px layout verified in local browser. Supplied real ticket tested locally without saving its customer details to test records or repository; initial recognition required focused retry and text cleanup. Camera and Apple Maps behavior require physical iPhone testing.


## Version 0.5.1

Added expandable Big Rock Ice Cubes tasks: New cubes put in the freezer; Completed cubes removed and stored. Checked children use the existing shift task storage and Mike report formatting.


## Version 0.6.0 — optional free lock-screen reminders

Settings now offers opt-in device notifications and a test button. Cloudflare Workers + D1 (confirmed Free plan) run separately from the GitHub Pages app and the existing blog service. No paid products enabled.

The app sends only a push subscription and active shift start/snooze timestamps; it never sends names, phone numbers, addresses, ticket images, odometers, rates, or reports. Notification tokens stay in this browser’s localStorage, outside JSON backups. Sample mode never registers or schedules. Driver setup code and VAPID private signing key live in Cloudflare secrets and ignored `notifications/setup.private.json`, not the public repository.

At start or when enabling during a shift, schedule Seattle cutoff +30 minutes (Sun–Thu 21:00, Fri–Sat 21:30). Ending a shift cancels; snoozing replaces the schedule. Offline changes persist for retry on launch/foreground/online. Old revisions cannot undo newer cancellation. Service checks each minute, retries transient push failures, expires overdue jobs after 2 hours, removes expired endpoints, and prunes inactive connections after 90 days. Delivery can be delayed by internet, iOS Focus settings, and provider availability. No guaranteed alarm behavior.

On iPhone open the Home Screen installation, Settings → Enable lock-screen reminders, enter Tony’s private driver setup code, and allow notifications. Send a test notification. Each phone enrolls separately, no shared orders or app login. Restoring a backup onto a new installation requires enabling notifications again.

Verification: 39 app tests plus 5 service tests (DST cutoff, enrollment/auth/origin/endpoint validation, schedule/cancel revisions, retries/expiry and encrypted modern Web Push); local notification Settings UI reviewed. Live Cloudflare health/configuration, synthetic schedule/cancel and stale-revision checks passed, and the temporary test connection was removed. Physical iPhone lock-screen delivery remains for driver validation after enrollment.


## Version 0.6.1 — notification request fix

Fixed a production-only Cloudflare error: its fetch implementation rejects redirect:error. Push delivery now uses redirect:manual, keeping notification credentials from following redirects while allowing the request to reach the provider. Reproduced the exact TypeError in the local Cloudflare runtime and verified a manual-redirect request reaches Apple’s server using a non-device URL. Added regression coverage for request options and test UI sending/accepted/failed states.

The test notification now shows persistent inline progress/result in Settings and disables the button while sending. Existing subscriptions and signing keys are preserved; no reenrollment should be needed for this fix. Physical device acceptance/display still requires a driver test.


## Version 0.7.0 — private visual reporting

Reports adds 14 visual panels: completed deliveries over time, single/batch trip donut, actual miles by shift, miles per completed delivery, departure-to-delivery medians, ready-to-departure medians, grouped single/batch timing comparison, duration distribution, signed scheduled-arrival deltas, weekday/hour completion heatmap, trip volume, kitchen check-offs by shift, task frequency bars, and a selectable shift timeline with kitchen events. Weekly/monthly/yearly/custom date controls apply to completed shifts across every chart. Monthly is the private monthly overview. Existing detailed records and CSV exports remain available.

Charts run locally using native SVG/HTML/CSS, without a chart service, third-party requests, new dependency, or cost. Bars/points/cells show their values on tap or keyboard focus; data tables/text accompany graphs. Navigation links jump to report sections. Print/save PDF uses the browser print dialog. Customer identity is omitted from chart labels and data tables. Mike’s EOS report and notification service are unchanged.

New recording fields: delivery.readyAt is captured by Mark ready and removed on Still preparing; delivery.departedAt is captured when a saved route starts. Existing run.startedAt remains usable as a recorded departure for old records. Ready timestamps are never inferred from audit/preparation status. For a delivered order with multiple recorded runs, use the latest applicable run start unless an explicit departure is available. Invalid/reversed or missing timing pairs yield null/unavailable; true zero-minute waits remain zero. Shift taskCompletedAt captures checked leaf tasks and special-note changes; unchecking clears that task timestamp. Legacy tasks without a time stay Not recorded in the timeline. JSON backups preserve these additive fields.

Metrics describe observations, not driver scores: departure-to-delivery includes walking/loading/traffic/earlier batch stops; added-to-ready is only the period after entering a ticket, not full kitchen preparation; whole-shift mileage includes restaurant returns and is not assigned to individual stops. Scheduled chart uses signed minutes from requested arrival, no assumed grace period, latest 20 plotted observations, coverage/totals across the full selection. Charts show observation counts, missing-data coverage and an early-records note for fewer than five shifts. Task counts are shifts with recorded check-offs, not required tasks or production quantities.

Sample mode gains deterministic fictional ready/departure/task times for explicitly synthetic finalized shifts only (analytics seed v2). Real data is never backfilled. Existing sample/manual test orders without the demo flag are untouched.

Validation: 45 app tests plus 5 notification-service tests passed. Added analytics checks for missing/reversed/zero durations, legacy departure selection, finalized/date-selected isolation, early/late signs, heatmap totals, task recording, sample-only enrichment, chart privacy, finite rendering and calendar aggregation. Browser QA at 390px: 14 panels without page overflow; monthly/yearly/custom totals, interactive point readouts, shift selector, timeline and empty weekly state verified; no console errors.


## Version 0.7.1 — explicit restaurant return

After the final single/batch drop-off, the active run records completedAt and completionKind=awaiting-return. Customer completion notes, required cold-item confirmation and text composition remain usable; after Done, a branded bottom card blocks the entire app and traps keyboard focus on End Run. The shell is inert; no tab changes, adding orders or ending shifts until return confirmation. Reopening reconstructs this gate from IndexedDB. End Run writes returnedAt, closes the run and logs the confirmation. It does not end the shift. Historical auto-closed runs remain closed without invented returns. History distinguishes final drop-off from physical return.

The existing free push enrollment now also schedules return reminders 10, 25 and 45 minutes after final drop-off. A separate bounded queue preserves EOS scheduling. Confirmation cancels the return queue, offline changes persist/retry on reconnection, stale revisions cannot reinstate canceled schedules, same-run resync preserves reminder progress, and jobs expire after two hours. Device permissions/Focus/connectivity still govern delivery; this is a reminder rather than location detection. No customer data is sent. Existing enrolled devices keep their credentials.

Deployment: apply notifications/run-reminders-migration.sql once to the existing D1 database before deploying the updated Worker and frontend. New databases use the expanded schema.sql. No secret or subscription changes required.

Validation: 48 app and 7 service tests, plus browser checks of cold-item/message completion, mobile layout, reload persistence, inaccessible underlying tabs and successful unlock. Physical iPhone return-reminder delivery still needs a field test. The separate demo cost comparison remains work in progress and is not included in this patch.


## Version 0.8.0 — sample delivery cost comparison

Reports → Cost comparison is available in sample mode, with a link from real Reports and direct entry at ?demo=1&report=costs. Direct entry opens Monthly; other date controls and inclusive custom dates use finalized shifts only. Six panels cover average cost per order, cumulative costs, a return-time/order-value sensitivity heatmap, hypothetical menu baskets, break-even order subtotals, and first-period extras. Inputs are session-only; presets and reset recalculate, with validated order shares totaling 100%. Native SVG/HTML charts include accessible readouts and data tables. CSV exports include assumptions and hypothetical/sample markers without customer identity; PDF uses browser print.

Research snapshot 2026-11-18: official DoorDash plans 15/25/30%, optional tablet $6/week, no activation/subscription; Uber Seattle Lite starting at 15%, Plus25% plus 5 percentage points weighted by Uber One share, Premium30%; Drive published $6.99–$10.99 midpoint assumption8.99 and Direct starting7.99, neither a Seattle quote. Seattle2026 wage21.30, user mileage0.73. Menu baskets solo21.50/duo56/family105 with assumed45/40/15 mix, editable. Exact current Uber equipment/setup not established; zero means omitted, not verified free. Published primary-source links and scope notes are in the app.

The model includes only wage for departure-to-return time plus whole-shift actual odometer mileage at the scenario rate. Batch shared time and overlapping intervals count once; latest applicable restarted-run ownership prevents double counting. Valid recorded returns take priority, otherwise a capped return allowance is used. Older real data is never backfilled. Sample returns are explicitly fictional. Sensitivity intentionally replaces all return times with each row assumption; main comparisons retain recorded returns. Weekly equipment is prorated over calendar days from first to last selected shift; one-time setup is separate. Missing timing/mileage withholds cost comparisons and thresholds. Negative differences remain negative; no actual savings, profit, incremental demand or full employment cost is asserted. Existing ordering/processing costs, payroll taxes, insurance, kitchen/idle wages and platform customer fees/tips are outside this limited model.

Validation: 53 app tests and 7 reminder-service tests. New model checks cover batch time, overlapping intervals, recorded/missing/reversed returns, incomplete data, negative results, weighted baskets, fee extras, one-time costs, Uber One weighting, validation, render/CSV privacy and immutable source records. Browser checks covered390px overflow, recalculation, invalid shares, presets, yearly range, chart readouts, CSV download and desktop rendering. Notification backend unchanged.


## Version 0.8.1 — sandbox business-value overview

Sample Reports → Cost comparison leads with estimated gross DoorDash commissions avoided and estimated net savings vs. DoorDash and Uber Eats. Default is an explicit same-paid-hours/shared-role scenario (0% of delivery wages removed if outsourced); editable presets test0/50/100%, with custom percentage, replacement kitchen hours and wage, and hypothetical period app price (currently free). Net advantage = platform fees/equipment + replacement paid labor required if outsourcing − mileage − avoidable driver wages − app price. Common payroll cancels rather than being described as saved. Recurring totals exclude one-time setup, first-period Uber savings show the setup effect separately. Negative results and all three staffing scenarios remain visible. Period replacement labor/app price are allocated equally across selected shifts for the cumulative chart and CSV; inputs apply once to the whole period, not every shift.

New visual sections show the savings breakdown, cumulative savings, staffing sensitivity, grouped-order activity and recorded kitchen-task check-offs. Orders are assigned to their latest applicable run before grouping, avoiding double-counting restarted orders; multi-order grouping is not claimed as proven mileage or time savings. Kitchen task counts do not add a monetary benefit. App-value section separates in-house delivery economics from software effects: scheduled on-time counts and cold-item confirmations describe sample activity, while actual entry-time improvement and missed-item rates are Not measured. Optional before/after seconds inputs produce a clearly illustrative time difference, permit negative results and never enter financial totals. Full allocation/basket/break-even charts remain accessible under an expandable details section, retaining the previous assumptions and negative comparisons.

Business fields remain session-only and sandbox-only; real shift records, payroll/reimbursement settings, EOS reports and notification service remain unchanged. CSV contains assumptions, gross fees, net savings and clear illustration flags, with no customer identity. Missing timing/mileage withholds net savings. No net-profit, guaranteed ROI or universal in-house advantage is asserted.

Validation:57 app tests plus7 service tests. Added shared-vs-dedicated wage math, replacement labor and app cost direction, cumulative reconciliation, one-time setup, negative entry-time illustration, evidence counts, incomplete coverage, bounds, immutable state and export privacy checks. Browser QA:390px page containment,100% avoidable scenario reverses the sign, replacement hours recalculate, optional illustrative entry-time difference, CSV download; desktop presentation checked.


## Version 0.9.0 — second field-test changes

Scanner findings: previous full-image/fast-model OCR retried a fixed crop only for empty fields, so nonempty garbage addresses were accepted as successful. New UI offers Apple Live Text import as the recommended free/on-device route, with editable field review and explicit confirmation before applying. Apple native Vision accurate recognition was compared locally on all four supplied photos: extracted house numbers matched all four, including the apartment on example2. This is a local Mac comparison, not proof of iPhone field accuracy. No customer photos, transcripts or identities are committed, uploaded to an OCR service, or used for training. Apple VisionKit is native-app functionality, not directly callable by this PWA; native iPhone recognition requires Scan Text/Live Text then import/review.

The alternate browser reader is explicitly experimental. Added exact-rear-camera request with framing guide, torch when advertised by the device, native-camera/photo fallback, draggable crop/corner handles and fine rotation, higher-resolution crops, grayscale/contrast retry and two segmentation modes using tessdata_best English. Parser rejects symbol garbage, preserves units appearing after city lines, retains numeric phone formatting and withholds conflicting/low-confidence addresses. Experimental reader still misread house numbers in supplied example1 even after a tighter crop; do not market it as fixed or reliable. Receipt outline helps framing but does not cure recognition errors. First use downloads the model (~12MB compressed); immutable OCR assets are cache-first and photos remain temporary. Browser camera/torch and iOS Scan Text need a physical-device check.

UI: directions-to-restaurant sits at the right of the delivery header. Completed expanded order Collapse replaces the redundant top-right Delivered badge. Settings shows only saved-customer count and a Manage button; individual/all deletion moved into that dialog. Alcohol orders show a red Check ID tag. Ending an alcohol run marks a persistent receipt-jar reminder that appears after End Run, acknowledges signed receipts stored for Ang, and can be shown again on reopening if deferred.

Catering: smaller Catering toggle in new/edit order form. Before delivery confirmation, two actual photo payloads (set-up and receipt) are mandatory. Photos are resized/re-encoded to JPEG, saved locally with capture time, included in full JSON backups, viewable on completed cards and History → Runs, and shared through the native file-share sheet. Completion offers Share catering photos with Mike; user must choose Messages and Mike because Web Share cannot preselect a recipient or attach files via sms: URLs. No automatic send or sent-status claim. Sample-mode sharing is disabled. Deleting saved customer records also removes linked catering photos, which can contain contact details. Backup restore permits up to250MB; individual photo payloads are validated as bounded JPEG data URLs. Local quota errors leave the existing saved state intact. Photos require regular private backups; they are not synchronized.

Grouping: pending/ready singles can be selected into a new batch, or one can join an existing unfinished batch. Existing Build Your Batch remains. Departed/completed singles cannot be reassigned; ready stops joining an active batch are added to its run. Do-not-text preference is saved per normalized address/unit, distinct from barking-dog notes, offered at order creation and completion, bypasses the customer text UI and guards the message handler. Seattle ZIP variants normalize without combining different units. Saved customer names/phones remain retained per prior decision; no automatic purge introduced.

Exports: private detailed CSV for all shifts (including current), all delivery statuses and completed task leaves with available timestamps, plus run membership/return, order flags, cold-item confirmation and catering-photo presence/times.35 columns and type=shift/delivery/task preserve empty shifts and multiple tasks without duplicating delivery counts. Customer contact details are deliberately included after an explicit private-export notice; no photo data is embedded in CSV. Existing shift-summary export stays available, and full backups include actual photos.

Run reminders: cancellation now bypasses a blocked EOS request and sends immediately with a newer revision, while normal run/EOS updates run concurrently. Already shown run notifications close when End Run is tapped. Server return pushes expire after60 seconds instead of15 minutes, reducing delayed delivery after return. Cannot recall a push already accepted by Apple, and offline cancellation still waits for reconnection. No silent-push suppression is used because Safari requires visible notifications. Existing enrollment and keys remain; no database migration or paid plan needed.

Validation:63 app tests plus8 service tests. New checks cover merge/move constraints, active-batch ready membership, DNT unit isolation/note preservation/backups, mandatory photos and backup validation, detailed CSV/task times, parser unit/garbage handling, cancellation bypassing a blocked EOS request and short push TTL. Browser QA used fictional catering photos: missing-photo block, both saved photos persisting across reopen, DNT bypass, share prompt, receipt-jar reminder after return, grouping existing orders, top-right Collapse, hidden customer list, recommended text import/review, and a608-record/35-column CSV with consistent row widths. Real supplied ticket photos were only read transiently; no real customer records were saved in demo data. iPhone camera/flash, file-share-to-Messages, and revised lock-screen reminder timing require the next field test.

Publishing resilience: site packages have a unique run/attempt name and the workflow waits for GitHub artifact metadata before publishing, avoiding a transient missing-package error and duplicate artifact names on retries.


## Version 0.9.1 — per-shift exports and catering defaults

Alcohol reminder retains the Alcohol receipt for Ang title; body now says “You’re back at the restaurant. Put the signed alcohol receipt in the jar.” Checkbox is “Signed receipt(s) are in the jar.” Primary button is Confirm. Add Delivery and Directions to restaurant share a full-width row below the Deliveries heading, left/right with aligned button/link text.

Removed v0.9.0 all-shifts detailed-export entry points from Reports and Settings and the global export action. Every finalized History row now has a right-side Export button. It immediately downloads delivery details and completed task records for that shift alone, with date and ID in the filename. Existing Reports shift-summary exports and sandbox scenario exports are unchanged. Customer details remain in the private per-shift CSV; photos remain in JSON backups rather than embedded in CSV.

Catering moved from the order form to a small auburn button at the bottom right of What are you taking out?. New catering orders use an independent draft seed (not an existing record), default company Lawless Forge and address45 S Spokane St, Seattle, WA98134, with an empty phone. Per-order company/address are editable; Settings essentials also exposes editable default catering company/address. Defaults fill missing/blank values without overwriting genuine custom settings. No catering phone default is stored and save-customer is unchecked for new catering drafts. Drinks/alcohol remain explicit required choices, and the two-photo completion requirement remains.

Validation:65 app tests plus8 service tests. Added migration/idempotency/custom-default/no-phone checks and single-shift CSV isolation. Browser QA at390px confirmed left/right action alignment, auburn chooser placement, company/address prefill and blank phone, editable Settings fields, and CSV download for one selected History shift. Downloaded CSV has exactly one distinct shift ID and that shift’s delivery/task records.


## v0.10.0 — in-app ticket scanning

The primary scanner now captures with the rear camera inside the delivery form and sends a metadata-stripped JPEG to Cloudflare Workers AI (`@cf/google/gemma-4-26b-a4b-it`). The returned name, phone, full address/unit and ticket number fill the existing form directly. There is no Photos-app trip, crop step, copy/paste, or separate review dialog. Drivers review those fields and explicitly confirm drinks/alcohol/scheduling before saving. After one-time connection, new single orders and batch stops open the camera automatically. Manual entry remains available; flashlight controls appear only when the browser supports them. An internet connection is required.

Scanner setup reuses an existing notification device enrollment to authorize a separate scanner credential, without requesting notification permission. Otherwise the existing driver setup code is required once. The credential stays on this installation, outside portable backups. Disable scanning in Settings.

Privacy: standard stateless inference only, `store:false`, no AI Gateway, cache, batch upload, R2, photo/text persistence or content logging. Worker observability remains disabled; failures return sanitized errors. D1 stores only hashed device credentials and short-lived account/day usage counters. Cloudflare's published zero-retention/no-training policy has security/legal exceptions; absolute erasure cannot be promised. See https://developers.cloudflare.com/workers-ai/platform/data-usage/ . Existing local customer records, catering photos, backups and CSV contents are unchanged. No customer photos or transcripts belong in this public repository.

Free usage is bounded to 60 attempts per UTC day across connected drivers, with a 1.5-second account request interval and the platform's Free-plan quota. There are no automatic retries, paid upgrades or paid fallbacks. Quota exhaustion falls back to manual entry. Apply `notifications/scanner-migration.sql` before deploying the Worker with its AI binding.

Four user-authorized ticket photos were tested against the real Cloudflare model: all four phones, house numbers, street names/directions and order numbers matched; the apartment/unit was retained. Three fully readable names matched; the fourth name could not be independently graded because it was marked over. Response times were 2.9–3.6 seconds on the test connection. These four samples are encouraging, not a general accuracy guarantee. Physical iPhone rear-camera, flashlight and cellular field testing remain necessary. Automated tests cover authorization, quota, sanitized errors, content-free storage, uncertain fields, metadata-stripping upload, offline behavior and credential reset.

Browser verification used an isolated local fixture with synthetic fields and the camera deliberately disabled: capture fallback filled the existing form, the scanner dialog closed, the next single order opened the camera screen automatically, and Enter manually returned to the form. Real model accuracy was tested separately against the four authorized photos; no desktop camera or notification permissions were granted.


## v0.10.1 — catering photo sharing in sample mode

Sample mode previously stopped catering sharing before opening the native share sheet. Its error was shown in the page notification behind the open dialog. Catering photo sharing now works in both modes; sample shares carry an explicit TEST label, and the driver still chooses Messages and the recipient manually. Other sample-mode messaging/reminder restrictions remain in place. No photos are uploaded to the app server.

Both the photo dialog and delivery-completion dialog now display sharing progress, failures, cancellation, and the unconfirmed result inside the open dialog. A pending native share disables its button until it resolves. Replacing a saved photo clears outdated share errors. Both set-up and receipt photos remain required, with no automatic message sending or recipient selection.

Validation: 70 app tests plus the existing 12 notification-service tests pass. New tests exercise two real attachment payloads, TEST labeling only for samples, unsupported devices, missing photos, cancellation and native share errors. Browser checks used fictional local records and two synthetic photos, confirmed local persistence across reload, visible missing-photo validation, and reaching the native sharing request from sample mode. The native picker could not be inspected through the available desktop controls; the iPhone Messages attachment flow still needs a device check.
