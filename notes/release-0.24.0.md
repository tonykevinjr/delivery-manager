# Convey 0.24.0 — field-test fixes

- Reduce pink/magenta thermal-paper warning dye on-device before cloud ticket recognition. Recognition instructions distinguish translucent dye from print and prohibit inventing obscured characters. No model fine-tuning or persistent receipt training data is introduced.
- Dispatch can request cancellation of its own unstarted orders. The driver validates pairing, current shift and departure state before applying it. Requests use the existing encrypted transport; canceled records remain in history.
- Remove individual non-active orders or clear finished orders from the counter view, with confirmation and a Show hidden orders recovery action. This is counter cleanup, not deletion of driver history.
- Compact End Run into a viewport-fixed dock above the measured bottom navigation. Reserve page space for the dock so completed-order controls remain reachable.
- Show recorded gross ticket tips so far, dinner/lunch amounts, unclassified tips and missing amounts on the Shift tab. Saved manual calculator totals remain separate.
- Review every recorded ticket tip before saving automatic dinner tip-out. Explicitly classify unknown tickets as lunch or dinner, with a one-tap dinner choice for unclassified tickets. Lunch remains excluded; an evening delivery is not proof that an order originated during dinner.

## Validation

- 142 frontend tests, including the reported $3.40 + $5.85 + $10.20 case, atomic period review, lunch exclusions, recovery exclusions, zero/missing tips, pixel processing, encrypted cancellation round-trip, duplicate requests and departure/pairing guards.
- 25 notification/backend tests.
- Browser checks on isolated fictional data: three-tip review saves $19.45; 390×844 viewport dock remains at the same position while scrolling and completed orders expand above it; counter cleanup and recovery work.
- The supplied pink ticket was inspected and a local normalized image compared. Recognition accuracy still requires field testing; opaque ink cannot be reconstructed.
