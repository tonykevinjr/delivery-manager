# Convey Management foundation — 0.23.0

Available at admin.html from the same origin as Dispatch. It reuses saved driver pairings on that counter device; no public customer data endpoint or new credential is introduced. Details are decrypted on the counter device. Driver tips, tip-out calculations and private reimbursement rates are excluded.

## Implemented

- Select a previously paired live or test driver.
- Read the latest shared current/completed shift: start, final mileage if available, completed/active/held counts and task completions.
- Inspect driver-created and counter-created orders, stages, item lists, notes and special-item flags.
- Export the latest shared shift snapshot as CSV. The shared-view size limit is reported when orders are omitted. This export is not a complete historical archive.
- Refresh every 15 seconds while visible; show last driver sync time.
- Request screen wake lock for an attended counter display where supported. Browsers/OS can release the lock; it is not kiosk device management.

## Permissions currently enforced

- A paired manager can read the shared shift and use its manager token to submit encrypted commands.
- Driver-created orders are view-only on Dispatch.
- Ready, grouping and route updates are validated on the driver against actual order status and originating Dispatch packet access. Started orders cannot be regrouped or remotely marked ready.
- This Management foundation cannot edit permissions, remove drivers, alter shifts, or expose private financial data. The UI states this plainly.

## Next admin phase

1. Establish an owner identity separate from scanner enrollment and driver pairing. Decide who is an owner (Mike, Ang, Tony for setup) and how ownership can be recovered. Do not treat a button, hidden menu or client-side PIN as authorization.
2. Create individual staff/device credentials and server-side capabilities for dispatch, readiness, route changes, cancellations, reports and access administration. Protect every request, not just the UI.
3. Audit grant/revoke/action events without logging customer payloads. Support device revocation and session expiry.
4. Obtain explicit driver sharing preferences for historical reports. Private tips and reimbursement remain excluded by default and in every export.
5. Define retention/deletion and encrypted historical report storage, including how data is recovered if a phone is lost. Do not upload IndexedDB/customer directories indiscriminately.
6. Add approved cancellation/edit workflows, with conflict handling for deliveries already underway.

The current scope starts the admin product without implying owner/staff roles are already implemented.
