# Stillora privacy

**Last updated: November 2026**

Stillora is designed as a local-first Chrome extension.

## Data stored

The current version stores the following information in Chrome's local extension storage:

- Website domains explicitly added by the user.
- The selected blocking mode.
- The active focus session and its timing information.
- A local history of completed or ended focus sessions.

## Data transmission

The current version does not operate an account system or remote application backend. It does not intentionally transmit the user's website list, browsing history, page contents or focus history to a Stillora server.

The interface currently uses system fonts and does not require remote analytics. If third-party assets, crash reporting, sync or hosted services are added in a future version, this policy must be revised before release.

## Permissions

- `storage`: save preferences and session history locally.
- `alarms`: complete a focus session at its deadline.
- `tabs`: bring already-open tabs under a newly activated blocking policy.
- `declarativeNetRequest`: redirect navigations that match the user's active policy.
- HTTP/HTTPS host access: enforce both blocklist and allowlist modes.

## User control

Users can edit their website rules, pause or end focus sessions, and remove the extension. Chrome extension permissions and local extension data are governed by Chrome's own settings and lifecycle.

## Contact

Before publishing, add a monitored support contact and the legal entity or individual responsible for the extension.
