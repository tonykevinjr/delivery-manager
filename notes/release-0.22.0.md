# Convey 0.22.0

- All new Dispatch orders enter Pending. Counter staff manually mark them Ready. Encrypted commands are scoped to the original pairing, reject started orders, and are idempotent. Queued new orders can receive a subsequent Ready command. Counter staff must open the updated driver app once to advertise support.
- Ready updates send a generic push only when the latest driver state indicates an open shift with no active run. Run availability is operational metadata; customer details remain encrypted. Refreshing does not re-notify. Availability is synchronized while the driver app is open; an offline departure cannot be observed by the server.
- Driver cards use distinct Pending/Ready/Active action colors and stronger charcoal dark-mode surfaces. Waiting work is oldest first, active work remains at the top.
- Address and batch-route previews open the selected maps client directly. Google routes exceeding four stops retain the section chooser.
- Detailed ticket scanning now requests item quantities/modifiers and explicitly printed tips. Tip data remains local to the driver and chosen exports; Dispatch status and Mike's report exclude it. Full-ticket field accuracy still needs restaurant field testing with the new small-print ticket samples. No invented order times or flags.
- Added optional actual order-placement timestamp and source. Added-to-ready remains separate from preparation time. Readiness/entry/departure/drop-off/return timestamps and local status-change events are retained; no historical stages are fabricated.
- Historical cold-item/alcohol reminders match exact normalized address and unit. Explicit No stays No after review.
- Report an issue on an active or expanded completed order through More. Select affected items or enter them manually; optional linked follow-ups start with restaurant pickup. Original completion stays recorded. Recovery visits do not inflate original-order headline counts or turn a one-customer run into a batch. Recovery stops lead route suggestions by default; Customize route can override the recovery recommendation. Ordinary scheduled-priority rules still apply after that override.
- Pickup checks include drinks/ice cream, alcohol, receipt/pen and recovery items. After a delivery issue, the run remains unfinished until its follow-up is completed or the driver explicitly manages/ends the run early.
- Per-shift CSV includes items, private ticket tips, known order time, issue records, recovery links and recorded events. Existing backups preserve these fields.
- Reports add an operations overview with issues by type, recovery completion, item-list coverage and known preparation-time coverage. Existing detailed visual reports remain.
- Personal customer calls/texts can be disabled per device. A shared texting service is not activated; see customer-messaging-options.md.

## Still external / requires follow-up

- Smile automatic order import and checkout SMS consent require their integration access, capabilities and pricing.
- Shared business SMS requires a provider/device architecture decision; no paid account or sender has been created.
- iPhone Shake to Undo is a system setting: Settings → Accessibility → Touch → Shake to Undo. A PWA cannot switch it off.
- Order-item scanner accuracy must be validated using real detailed-ticket photos. This release does not claim a trained or perfectly accurate new model.
- Tog's separate product-profitability page models per-project revenue/cost/support/churn/acquisition and startup payback. It is a scenario tool, distinct from Convey restaurant delivery savings.
