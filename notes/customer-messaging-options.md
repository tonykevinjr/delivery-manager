# Customer messaging options — November 24, 2026

Implemented now: drivers can disable personal customer calls/texts in Settings → Scanner, dispatch & reminders → Customer contact & your number. This does not disable Mike's EOS report or Tony's help contacts. No shared SMS provider has been enrolled and no money has been spent.

## Paths to investigate with the restaurant

1. Existing counter phone: staff can manually send from the restaurant's current number using its existing mobile plan. No additional Convey messaging subscription is required. This does not automatically let an iPhone PWA send from the Android phone. A counter-side approved messaging queue or a separately installed Android gateway would need additional design, device access, delivery acknowledgments and outage handling. Do not advertise this as an existing automatic feature.
2. Smile's own messaging: ask whether their delivery-order integration supports consent and transactional updates from the restaurant's sender. Access and pricing have not been established. Online opt-in requires Smile to expose/configure that checkout option.
3. Dedicated business SMS API: Twilio or Telnyx. Drivers could request messages through a private backend without exposing personal numbers. Recipients, reply handling, consent, opt-outs, message status, provider retention and budget limits must be designed before activation. API secrets stay out of GitHub/frontend code. This introduces third-party processing of recipient numbers and message bodies and needs the restaurant's provider/account decision.

## Published provider information

- Twilio publishes SMS starting at $0.0083 per segment, plus carrier fees, number rental, and applicable registration/campaign fees. 1,000 outbound single-segment texts therefore start at $8.30 for the base message charge alone, not a complete monthly quote. Replies and long messages add cost. https://www.twilio.com/en-us/pricing/messaging and https://www.twilio.com/en-us/sms/pricing/us
- Telnyx offers usage-based SMS with separate phone-number, carrier and 10DLC costs. Obtain a full quote for the restaurant's use case; do not compare only headline message rates. https://telnyx.com/pricing/messaging and https://support.telnyx.com/en/articles/5634625-10dlc-fees-and-charges
- No suitable permanently free, production-volume automatic SMS API has been verified. Free trials do not establish a sustainable free operation.

A customer is never told a message was sent merely because Messages opened. ETA/stops-ahead texts require current route state and should avoid promises that become false after a route change. Ready, departure and delivery texts should honor address-and-unit do-not-text preferences and confirmed customer consent.
