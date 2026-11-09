# Chrome Web Store release checklist

## Functional verification

- [ ] Install the production `dist/` build as an unpacked extension in a clean Chrome profile.
- [ ] Verify blocklist rules for exact domains, `www`, nested subdomains and lookalike domains.
- [ ] Verify allowlist exceptions and the catch-all redirect.
- [ ] Verify HTTP and HTTPS main-frame navigation.
- [ ] Verify existing open tabs are redirected when a session starts or resumes.
- [ ] Verify pause removes rules and resume reapplies them.
- [ ] Verify end and completion remove rules.
- [ ] Verify alarms and state recovery after Chrome restart.
- [ ] Verify two simultaneous UI surfaces stay consistent after state changes.
- [ ] Verify invalid domains and duplicate domains are handled.
- [ ] Verify browser-internal pages are not affected.

## Permissions and privacy

- [ ] Review every requested permission against a user-facing feature.
- [ ] Explain broad host access in onboarding and the store listing.
- [ ] Test first-run permission prompts in a fresh profile.
- [ ] Confirm no browsing history or page content is sent to a server.
- [ ] Remove remote font requests if offline-only operation is a release requirement.
- [ ] Publish a privacy policy that matches the shipped code and data practices.
- [ ] Verify incognito is not claimed unless separately implemented and tested.

## Store assets and operations

- [ ] Add original PNG icons at 16, 48 and 128 pixels.
- [ ] Capture current Chrome screenshots of popup, dashboard and blocked page.
- [ ] Write a concise store description and permission justifications.
- [ ] Choose and add an open-source license if desired.
- [ ] Test the packaged ZIP from a clean checkout.
- [ ] Verify the Chrome Web Store developer account and listing details.
- [ ] Review Chrome Web Store Developer Program Policies before submission.

## Release gate

A green build is not equivalent to a verified extension release. Do not submit until the functional and permission checks above have been completed in Chrome.
