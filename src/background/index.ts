import { readState, writeState } from "../shared/storage";
import type { Message, StilloraState, FocusSession } from "../shared/types";
import { domainMatches, normalizeDomain } from "../shared/domain";
import { syncBlockingRules } from "./blocking";

const END_ALARM = "stillora.session-end";

async function refreshRules(state: StilloraState): Promise<void> {
  const active = state.session?.status === "running";
  await syncBlockingRules(active ? state.mode : "blocklist", active ? state.websites : []);
}

async function redirectAlreadyOpenTabs(state: StilloraState): Promise<void> {
  if (state.session?.status !== "running") return;
  const tabs = await chrome.tabs.query({});
  const enabledDomains = state.websites.filter((site) => site.enabled).map((site) => site.domain);
  for (const tab of tabs) {
    if (!tab.id || !tab.url) continue;
    let url: URL;
    try { url = new URL(tab.url); } catch { continue; }
    if (url.protocol !== "http:" && url.protocol !== "https:") continue;
    const matches = enabledDomains.some((domain) => domainMatches(url.hostname, domain));
    const blocked = state.mode === "blocklist" ? matches : !matches;
    if (blocked) {
      await chrome.tabs.update(tab.id, { url: chrome.runtime.getURL("blocked.html") });
    }
  }
}

async function applyPolicy(state: StilloraState, redirectOpenTabs = false): Promise<void> {
  await refreshRules(state);
  if (redirectOpenTabs) await redirectAlreadyOpenTabs(state);
}

async function closeSession(outcome: "completed" | "ended-early"): Promise<StilloraState> {
  const state = await readState();
  const session = state.session;
  if (!session) return state;
  const now = Date.now();
  const remaining = session.status === "running" && session.endsAt
    ? Math.max(0, session.endsAt - now)
    : session.remainingMs;
  const record = {
    id: session.id,
    startedAt: session.startedAt,
    endedAt: now,
    focusedMs: Math.max(0, session.durationMs - remaining),
    outcome
  };
  const next = { ...state, session: null, history: [record, ...state.history].slice(0, 500) };
  await chrome.alarms.clear(END_ALARM);
  await writeState(next);
  await applyPolicy(next);
  return next;
}

async function reconcile(): Promise<void> {
  const state = await readState();
  if (state.session?.status === "running" && state.session.endsAt) {
    if (state.session.endsAt <= Date.now()) {
      await closeSession("completed");
      return;
    }
    await chrome.alarms.create(END_ALARM, { when: state.session.endsAt });
  }
  await applyPolicy(state);
}

async function startSession(durationMinutes: number): Promise<StilloraState> {
  if (!Number.isFinite(durationMinutes) || durationMinutes < 1 || durationMinutes > 480) {
    throw new Error("Choose a duration between 1 and 480 minutes.");
  }
  const current = await readState();
  if (current.session) await closeSession("ended-early");
  const now = Date.now();
  const durationMs = Math.round(durationMinutes) * 60_000;
  const session: FocusSession = {
    id: crypto.randomUUID(),
    status: "running",
    startedAt: now,
    endsAt: now + durationMs,
    remainingMs: durationMs,
    durationMs
  };
  const next = { ...await readState(), session };
  await writeState(next);
  await chrome.alarms.create(END_ALARM, { when: session.endsAt! });
  await applyPolicy(next, true);
  return next;
}

async function pauseSession(): Promise<StilloraState> {
  const state = await readState();
  const session = state.session;
  if (!session || session.status !== "running" || !session.endsAt) return state;
  const remainingMs = Math.max(0, session.endsAt - Date.now());
  const next = { ...state, session: { ...session, status: "paused" as const, endsAt: null, remainingMs } };
  await chrome.alarms.clear(END_ALARM);
  await writeState(next);
  await applyPolicy(next);
  return next;
}

async function resumeSession(): Promise<StilloraState> {
  const state = await readState();
  const session = state.session;
  if (!session || session.status !== "paused") return state;
  const endsAt = Date.now() + session.remainingMs;
  const next = { ...state, session: { ...session, status: "running" as const, endsAt } };
  await writeState(next);
  await chrome.alarms.create(END_ALARM, { when: endsAt });
  await applyPolicy(next, true);
  return next;
}

async function handleMessage(message: Message): Promise<unknown> {
  switch (message.type) {
    case "GET_STATE":
      return readState();
    case "START_SESSION":
      return startSession(message.durationMinutes);
    case "PAUSE_SESSION":
      return pauseSession();
    case "RESUME_SESSION":
      return resumeSession();
    case "END_SESSION":
      return closeSession("ended-early");
    case "SAVE_WEBSITES": {
      const current = await readState();
      const normalized = message.websites.map((site) => ({
        ...site,
        domain: normalizeDomain(site.domain)
      }));
      const unique = [...new Map(normalized.map((site) => [site.domain, site])).values()];
      const next = { ...current, websites: unique };
      await writeState(next);
      await applyPolicy(next, true);
      return next;
    }
    case "SET_MODE": {
      const current = await readState();
      const next = { ...current, mode: message.mode };
      await writeState(next);
      await applyPolicy(next, true);
      return next;
    }
  }
}

chrome.runtime.onMessage.addListener((message: Message, _sender, respond) => {
  void handleMessage(message)
    .then(respond)
    .catch((error: unknown) => respond({ error: error instanceof Error ? error.message : "Unexpected error." }));
  return true;
});

chrome.runtime.onInstalled.addListener(() => { void reconcile(); });
chrome.runtime.onStartup.addListener(() => { void reconcile(); });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === END_ALARM) void closeSession("completed");
});
void reconcile();