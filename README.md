# Stillora

**Protect your focus. Own your time.**

Stillora is a local-first Chrome extension for intentional browsing, built with Manifest V3, React, TypeScript, Vite and CRXJS.

## Included

- Premium dashboard and extension popup
- Domain management with normalization, validation and duplicate protection
- Blocklist and allowlist configuration
- Declarative Net Request redirects for selected websites
- Timed focus sessions with start, pause, resume, end and automatic completion
- Full-tab Stillora blocking page
- Existing-tab reconciliation when a policy starts or Chrome restores an active session
- Recurring weekday, weekend and daily schedules, including overnight windows
- Local focus-session history and analytics
- Local configuration using `chrome.storage.local`
- Unit tests and GitHub Actions verification workflow

## Development

Requires Node.js 20+.

```bash
npm install
npm test
npm run typecheck
npm run build
```

Load the generated `dist/` directory from `chrome://extensions` with Developer mode enabled.

## Permissions and privacy

The extension requests `storage`, `alarms`, `tabs`, Declarative Net Request, and HTTP/HTTPS host access. Settings, schedules and focus-session history are kept in local Chrome storage. This project currently has no remote API or account system. See [PRIVACY.md](PRIVACY.md).

## Limitations before public release

- Chrome internal/protected pages cannot be blocked like ordinary websites.
- Extensions cannot stop their owner from disabling or uninstalling them.
- Existing-tab handling, browser restart recovery, DNR quotas and permission prompts still require manual Chrome verification.
- Schedule transitions are evaluated on a one-minute alarm cadence.
- Analytics currently records focus sessions, not every attempted blocked navigation; production DNR does not expose a general per-navigation event stream.
- Cloud sync, onboarding, import/export and incognito support are not implemented.
- Original PNG extension icons, store screenshots and final Chrome Web Store review remain outstanding.

See [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) before publishing.
