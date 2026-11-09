# Stillora

**Protect your focus. Own your time.**

Stillora is a local-first Chrome extension for intentional browsing. It uses Manifest V3, React, TypeScript, Vite and CRXJS.

## Current scope
- Premium dashboard and compact popup
- Domain list management and input validation
- Blocklist and allowlist modes
- DNR-based redirect rules for active focus sessions
- Timed sessions with start, pause, resume and end
- Full-tab Stillora blocking page
- Local configuration in chrome.storage.local

## Development
Requires Node.js 20+.

```bash
npm install
npm run dev
npm test
npm run build
```

Load `dist/` from `chrome://extensions` with Developer mode enabled.

## Permissions & privacy
The extension requests storage, alarms, tabs, Declarative Net Request, and HTTP/HTTPS host access. The initial release stores settings/session state locally and does not send browsing data to a server.

## Known limitations
- Chrome internal/protected pages cannot be controlled like ordinary websites.
- Extensions cannot prevent their owner from disabling or uninstalling them.
- Schedules, durable analytics, sync, import/export and onboarding are not implemented yet.
- Verify DNR quotas, host permission UX and store review requirements against the target Chrome version before publishing.

No license has been selected yet; add one before accepting external contributions.
