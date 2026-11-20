# Delivery Manager reminder service

Free Cloudflare Worker and D1, isolated from the blog. `wrangler.jsonc` identifies only this service and database. Cron checks once per minute. Keep the account on Workers Free; do not upgrade or add paid products.

## Maintenance

Run `npm ci --prefix notifications` and `npm test --prefix notifications`. App tests: `npm test`. Deploy with `npx wrangler@4.164.0 deploy --config notifications/wrangler.jsonc` after checks. GitHub Pages deployment publishes only dist; it does not redeploy this Worker.

Initial schema: `npx wrangler@4.164.0 d1 execute delivery-manager-reminders --remote --file notifications/schema.sql --config notifications/wrangler.jsonc`. Secrets: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, ENROLLMENT_CODE. Use the secret bulk command with the ignored setup.private.json file, never publish that file or put private values in config, client JS, commits, logs or URLs. Preserve the signing keys across deployments; changing them requires reenrollment.

Setup code grants device enrollment only (10-device cap). Each installation generates a 256-bit bearer token; D1 stores only its SHA-256 hash. Other devices cannot read, schedule or cancel that device’s reminder without the token. CORS restricts browser callers; token authentication is the actual access control. Push endpoint hosts are allowlisted to Apple, Google, Mozilla. Request size and test notification frequency are limited. There is no API for listing driver information.

The table stores encrypted-delivery subscription details, one reminder due/expiry, revision, attempts, and housekeeping timestamps. No customer or mileage fields. Notification connections are sensitive: treat database access and backups as private. Inactive connections expire after 90 days; no customer retention policy changes.

Accepted push response confirms only provider acceptance, not display or reading. Drivers must verify a real lock-screen test on their own device, with notification permission and Focus configured. Offline cancellation can leave a stale reminder; opening the app reconciles the schedule.

## v0.13.0 — Oil-change tracker

Settings includes a personal oil-change schedule, an editable next target, and a current odometer update for personal driving. Shift odometer entries also update the reminder mileage. Recording an oil change resets the target to the actual mileage plus 5,000. Sample mode never sends oil emails.

Email delivery remains disabled until a free sender is verified. Authenticated setup can prefill private starting values; personal email and initial mileage are not embedded in the public app. Each installation explicitly enables email. Only the vehicle schedule and latest odometer go to the reminder service; no customer details or shift reports are included. Failed updates retry when the app reconnects. The server deduplicates each cycle's 500-mile and due reminders, bounds retries, and caps daily sends.

Deployment: apply notifications/oil-migration.sql, then deploy the Worker. Private secrets are OIL_EMAIL_TO, OIL_INITIAL_LAST, OIL_INITIAL_DUE, OIL_EMAIL_KEY and OIL_EMAIL_FROM. OIL_EMAIL_READY must remain false until the sender is verified. The email adapter supports Resend; use a verified sending subdomain without changing existing domain nameservers or mail forwarding. No paid upgrade is authorized. Mileage reminders depend on readings entered in the app; the app cannot read the car's odometer automatically.
