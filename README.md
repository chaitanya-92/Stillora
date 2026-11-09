# Stillora

**Protect your focus. Own your time.**

Stillora is a local-first Chrome extension for intentional browsing, built with Manifest V3, React, TypeScript, Vite and CRXJS.

## Included
- Premium dashboard and extension popup
- Domain management with normalization and validation
- Blocklist and allowlist configuration
- Declarative Net Request redirects during active focus sessions
- Timed focus sessions with start, pause, resume and end
- Full-tab Stillora blocking page
- Local configuration using chrome.storage.local
- Unit tests and GitHub Actions verification workflow

## Development
Requires Node.js 20+.

```bash
npm install
npm test
npm run build
```

Load the generated `dist/` directory from `chrome://extensions` with Developer mode enabled.

## Permissions and privacy
The extension requests storage, alarms, tabs, Declarative Net Request, and HTTP/HTTPS host access. Settings and active session state are kept in local Chrome storage. This project currently has no remote API or account system.

## Limitations before public release
- Chrome internal/protected pages cannot be blocked like ordinary websites.
- Extensions cannot stop their owner from disabling or uninstalling them.
- Existing tabs, browser restart recovery, DNR quotas and permission prompts need manual Chrome verification.
- Schedules, long-term analytics, cloud sync, onboarding and import/export are not implemented yet.
- A license has not yet been chosen.
