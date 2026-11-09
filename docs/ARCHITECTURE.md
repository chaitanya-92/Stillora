# Stillora architecture

## Runtime boundaries

Stillora is a Manifest V3 extension with three React entry points and one background service worker.

- **Popup**: short actions and current session controls.
- **Dashboard**: website policy, focus sessions and local session history.
- **Blocked page**: extension-owned destination used by Declarative Net Request redirects.
- **Service worker**: owns policy changes, alarms, durable session transitions and rule synchronization.

The UI never writes DNR rules directly. It sends typed messages to the service worker. The worker reads and writes the canonical state in `chrome.storage.local`, then synchronizes the DNR rules.

## State

The `stillora.state` storage key contains:

- `mode`: blocklist or allowlist.
- `websites`: normalized domain entries with enabled state.
- `session`: active or paused focus session.
- `history`: most recent 500 session records.

The service worker treats storage as the source of truth. Alarm events and browser startup reconcile the persisted session with its deadline.

## Blocking policy

### Blocklist

Each enabled domain gets a high-priority main-frame redirect rule using Chrome's domain-aware `urlFilter` syntax (`||example.com^`). This matches the exact domain and its subdomains without matching lookalike suffixes.

### Allowlist

Each enabled domain gets a higher-priority `allow` rule. A lower-priority catch-all HTTP/HTTPS main-frame rule redirects other sites to `blocked.html`.

Rules are active only while a focus session is running. Pausing, ending or completing a session removes active rules.

## Session lifecycle

A session has a start timestamp, deadline, original duration and remaining duration. The countdown is derived from timestamps; it does not depend on a background JavaScript interval.

- Start: persist session, create alarm, synchronize rules and redirect already-open blocked tabs.
- Pause: calculate remaining duration, persist paused state, clear alarm and remove rules.
- Resume: create a new deadline from remaining duration, recreate alarm and apply rules.
- Complete/end: append a session record, clear the active session and remove rules.
- Browser startup: reconcile the stored deadline and recreate the alarm if required.

## Permissions

The current build requests `storage`, `alarms`, `tabs`, `declarativeNetRequest`, and HTTP/HTTPS host access. Broad host access is needed for allowlist mode because any non-approved HTTP/HTTPS top-level navigation must be eligible for redirection.

## Known platform boundaries

- Browser-internal and protected pages cannot be blocked like ordinary web pages.
- An extension cannot prevent its owner from disabling or uninstalling it.
- DNR does not provide a general production event stream for counting every blocked navigation.
- Incognito access requires a separate user opt-in in Chrome.
- Redirects currently use a neutral message; the original URL is not reliably exposed to the destination page by a static extension redirect.
- Scheduled sessions, cloud sync, account systems, import/export and full cross-device analytics are not part of this release.
