# Delivery Manager reminder service

Free Cloudflare Worker and D1, isolated from the blog. `wrangler.jsonc` identifies only this service and database. Cron checks once per minute. Keep the account on Workers Free; do not upgrade or add paid products.

## Maintenance

Run `npm ci --prefix notifications` and `npm test --prefix notifications`. App tests: `npm test`. Deploy with `npx wrangler@4.164.0 deploy --config notifications/wrangler.jsonc` after checks. GitHub Pages deployment publishes only dist; it does not redeploy this Worker.

Initial schema: `npx wrangler@4.164.0 d1 execute delivery-manager-reminders --remote --file notifications/schema.sql --config notifications/wrangler.jsonc`. Secrets: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, ENROLLMENT_CODE. Use the secret bulk command with the ignored setup.private.json file, never publish that file or put private values in config, client JS, commits, logs or URLs. Preserve the signing keys across deployments; changing them requires reenrollment.

Setup code grants device enrollment only (10-device cap). Each installation generates a 256-bit bearer token; D1 stores only its SHA-256 hash. Other devices cannot read, schedule or cancel that device’s reminder without the token. CORS restricts browser callers; token authentication is the actual access control. Push endpoint hosts are allowlisted to Apple, Google, Mozilla. Request size and test notification frequency are limited. There is no API for listing driver information.

The table stores encrypted-delivery subscription details, one reminder due/expiry, revision, attempts, and housekeeping timestamps. No customer or mileage fields. Notification connections are sensitive: treat database access and backups as private. Inactive connections expire after 90 days; no customer retention policy changes.

Accepted push response confirms only provider acceptance, not display or reading. Drivers must verify a real lock-screen test on their own device, with notification permission and Focus configured. Offline cancellation can leave a stale reminder; opening the app reconciles the schedule.
