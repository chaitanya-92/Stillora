# Stillora

**Protect your focus. Own your time.**

Stillora is a local-first Chrome extension for intentional browsing, built with Manifest V3, React, TypeScript, Vite and CRXJS.

## Included

- Premium dashboard and compact extension popup
- One-tap, untimed **Start protection / Stop protection** controls
- Blocklist and allowlist switching directly in the popup and dashboard
- Search-result access in allowlist mode: Google, Bing, DuckDuckGo and Brave Search result pages remain available, while restricted destination websites are still blocked
- Dedicated blocked page with a search field that submits a web query rather than directly opening a destination
- Domain management with normalization, validation and duplicate protection
- Declarative Net Request redirects for restricted websites
- Recurring weekday, weekend and daily schedules, including overnight windows
- Local focus-session history and analytics
- Local configuration using `chrome.storage.local`
- Unit tests and GitHub Actions build/package verification

## Visual identity

The Stillora interface uses a calm, high-contrast midnight palette:

| Token | Hex | Use |
|---|---|---|
| Midnight | `#0A1020` | Main page background |
| Slate Navy | `#111A2D` | Cards and popup surfaces |
| Raised Navy | `#172238` | Secondary surfaces |
| Soft Lavender | `#A78BFA` | Primary actions and brand accent |
| Mist Lavender | `#BDAEFF` | Headlines and focus details |
| Calm Teal | `#5EEAD4` | Active/protected status |
| Cloud | `#F4F6FC` | Primary text |
| Muted Slate | `#91A0B8` | Secondary text |
| Rose | `#FB7185` | Errors and destructive actions |

Lavender is reserved for primary actions; teal is reserved for a positive active state. This keeps the interface calm and avoids competing accent colors.

## Search behavior

In allowlist mode, Stillora allows search-result pages on Google, Bing, DuckDuckGo and Brave Search so research can continue. This is deliberately limited to search-result URL patterns. When a user opens a destination website, the normal allowlist rule is applied and an unapproved site is redirected to the Stillora blocked page. Search is not a bypass for restricted destinations.

Chrome's own address bar and suggestion dropdown are controlled by Chrome. Stillora does not replace or intercept the omnibox UI; it evaluates the navigation after the user submits or selects a destination.

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
- Search-result pages are intentionally available in allowlist mode; links to restricted destinations remain blocked.
- Browser restart recovery, DNR quotas and permission prompts still require manual Chrome verification.
- Schedule transitions are evaluated on a one-minute alarm cadence.
- Analytics records focus sessions, not every attempted blocked navigation.
- Cloud sync, onboarding, import/export and incognito support are not implemented.
- Original PNG extension icons, store screenshots and final Chrome Web Store review remain outstanding.

See [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md) before publishing.
