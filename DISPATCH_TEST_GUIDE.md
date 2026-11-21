# Try Mike’s dispatch from your Mac and iPhone

Mike can add orders and request a batch from his unstarted single orders. Other edits and cancellations are not supported yet. Test with made-up names and addresses, not real customers.

1. Update the iPhone app to version 0.16.1 through Settings → Check for updates.
2. On the iPhone, open Settings → Explore sample records. The yellow SAMPLE MODE banner should be visible.
3. In sample-mode Settings, find Mike’s dispatch and tap Pair manager device. Enter the driver setup code if asked. Copy the private pairing code.
4. On your Mac, open https://tonykevinjr.github.io/delivery-manager/manager.html and paste that code into Connect to a driver. If Universal Clipboard is enabled, copying on the iPhone lets you paste directly on the Mac. The manager screen must say TEST DISPATCH.
5. Add three fictional orders on the Mac. Select One batch and tap Send addition to driver.
6. Return to Deliveries in the iPhone app. With an active sample shift, the orders should appear automatically within about eight seconds, all orange and marked From Mike · Addition 1. No Import button is needed. If a form or scanner is open, close it first so the dispatch can be added safely.
7. Send a separate order. It should be blue and marked Addition 2. Further sends use purple, yellow, then orange. The next addition restarts at orange whenever no unfinished Mike orders remain; completed colors stay unchanged. Each new shift also starts at orange.
8. Refresh status on the Mac. Received means the order is saved on the iPhone. It does not mean the food has been delivered. Queued means awaiting collection. Orders wait when no shift is active and expire after 24 hours.

## Lock-screen test

Your iPhone’s installed Home Screen app must already have lock-screen reminders enabled in real-mode Settings. This is the existing free notification connection. Return to sample-mode Settings → Mike’s dispatch and tap Connect dispatch notifications.

Lock the iPhone and send a new fictional addition from the Mac. A Test dispatch update from Mike alert should arrive. Delivery depends on the network and iOS notification/Focus settings. Tap it: it should open the sample app and add the order after opening. If notifications are unavailable, additions still arrive when the app is open and connected.

Ordinary shift/run reminders remain off in sample mode; only this explicitly connected test-dispatch channel can notify.

## Other checks

- Keep the iPhone app closed during a send, then reopen it. The queued addition should appear once.
- Refresh/reopen the driver app: received orders must not duplicate.
- Disconnect the iPhone temporarily; send an addition; reconnect and reopen the app.
- Keep an order-entry form open while Mike sends. It must remain intact; close it to collect the addition.
- Disconnect manager in driver Settings. The old manager pairing should no longer send.

## Before the restaurant test

Repeat pairing from real-mode Settings only when ready for real orders. Test and live pairings are separate. The restaurant phone still needs a camera/scan and screen-layout check. Keep pairing codes private; do not put them in shared documents or public code. Report any unexpected import, wrong mode, duplicate, or missing alert before using dispatch for a busy shift.

Mike’s changes/cancellations are the next stage. For now, he should contact the driver directly if a sent order needs correction. The driver can edit received addresses and manage orders locally using the existing controls.

## Saved drivers and ready orders

Pair each driver phone once per mode. On the manager screen, choose Pair another driver, enter Tony or Charlotte as its name and paste that phone’s code. Both remain in Send orders to. Choose the intended driver before entering the next addition; the send button names the recipient. Existing pairings migrate automatically. Rename driver changes only its manager-side label. Clearing browser data, moving to another phone/browser, or disconnecting requires pairing again. Test and live are separate pairings.

New Mike additions arrive Ready. Singles show Start delivery; batches show Start batch. The driver controls departure. Manager-ready orders do not count as measured zero-minute kitchen preparation in reports.

## Shared orders and batch recommendations

Update the driver app first, then refresh the manager page. In Your dispatched orders, Mike sees only orders he sent to the selected driver, with their current grouping, colors, ready/active/delivered state, notes and last-sync time. The driver must open the app while connected to refresh the shared view; it is not continuous vehicle tracking.

Send two separate singles. Once the updated driver app has synced, Mike gets a Take these orders together? prompt. Create batch sends a request; the original orders are grouped in place and no new delivery copies are created. The first remaining batch is orange; a second concurrent batch is blue. Mike can also select two to twelve unstarted singles and use Create batch from selected. The driver rejects the request if an order is already grouped, missing, completed or underway. Mike sees the result after the driver syncs.

The manager has a local sent-order history and an encrypted recent status view in the server. Shared views expire 24 hours after the driver’s last upload and are refreshed only while connected. Private driver tips, mileage, reimbursement, saved-customer directory and unrelated deliveries are excluded. Existing completed colors are preserved; the update corrects unfinished colors under the new reset rule.
