# Try Mike’s dispatch from your Mac and iPhone

This first version adds orders only. Mike cannot edit or cancel sent orders yet. Test with made-up names and addresses, not real customers.

1. Update the iPhone app to version 0.15.1 through Settings → Check for updates.
2. On the iPhone, open Settings → Explore sample records. The yellow SAMPLE MODE banner should be visible.
3. In sample-mode Settings, find Mike’s dispatch and tap Pair manager device. Enter the driver setup code if asked. Copy the private pairing code.
4. On your Mac, open https://tonykevinjr.github.io/delivery-manager/manager.html and paste that code into Connect to a driver. If Universal Clipboard is enabled, copying on the iPhone lets you paste directly on the Mac. The manager screen must say TEST DISPATCH.
5. Add three fictional orders on the Mac. Select One batch and tap Send addition to driver.
6. Return to Deliveries in the iPhone app. With an active sample shift, the orders should appear automatically within about eight seconds, all orange and marked From Mike · Addition 1. No Import button is needed. If a form or scanner is open, close it first so the dispatch can be added safely.
7. Send a separate order. It should be blue and marked Addition 2. Further sends use purple, yellow, then orange. The sequence starts at orange in each new shift.
8. Refresh status on the Mac. Received means the order is saved on the iPhone. It does not mean the food has been delivered. Queued means awaiting collection. Orders wait when no shift is active and expire after 24 hours.

## Lock-screen test

Your iPhone’s installed Home Screen app must already have lock-screen reminders enabled in real-mode Settings. This is the existing free notification connection. Return to sample-mode Settings → Mike’s dispatch and tap Connect dispatch notifications.

Lock the iPhone and send a new fictional addition from the Mac. A Test dispatch from Mike alert should arrive. Delivery depends on the network and iOS notification/Focus settings. Tap it: it should open the sample app and add the order after opening. If notifications are unavailable, additions still arrive when the app is open and connected.

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
