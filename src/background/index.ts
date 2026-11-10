import { readState, writeState } from "../shared/storage";
import type { Message, StilloraState, FocusSession, ExistingTabAction } from "../shared/types";
import { domainMatches, normalizeDomain } from "../shared/domain";
import { syncBlockingRules } from "./blocking";
import { isScheduleActive, isScheduleValid } from "../shared/schedules";

const END_ALARM = "stillora.session-end";
const SCHEDULE_ALARM = "stillora.schedule-check";

function policyIsActive(state: StilloraState): boolean {
  return state.session?.status === "running" || isScheduleActive(state.schedules);
}
async function refreshRules(state: StilloraState): Promise<void> {
  const active = policyIsActive(state);
  await syncBlockingRules(active ? state.mode : "blocklist", active ? state.websites : []);
}
async function redirectAlreadyOpenTabs(state: StilloraState, action: ExistingTabAction = "redirect"): Promise<void> {
  if (!policyIsActive(state)) return;
  const tabs = await chrome.tabs.query({});
  const enabledDomains = state.websites.filter((site) => site.enabled).map((site) => site.domain);
  for (const tab of tabs) {
    if (!tab.id || !tab.url) continue;
    let url: URL;
    try { url = new URL(tab.url); } catch { continue; }
    if (url.protocol !== "http:" && url.protocol !== "https:") continue;
    const matches = enabledDomains.some((domain) => domainMatches(url.hostname, domain));
    const blocked = state.mode === "blocklist" ? matches : !matches;
    if (blocked) { if (action === "close") await chrome.tabs.remove(tab.id); else await chrome.tabs.update(tab.id, { url: chrome.runtime.getURL("blocked.html") }); }
  }
}
async function applyPolicy(state: StilloraState, redirectOpenTabs = false, tabAction: ExistingTabAction = "redirect"): Promise<void> {
  await refreshRules(state);
  if (redirectOpenTabs) await redirectAlreadyOpenTabs(state, tabAction);
}
async function closeSession(outcome: "completed" | "ended-early"): Promise<StilloraState> {
  const state = await readState();
  const session = state.session;
  if (!session) return state;
  const now = Date.now();
  const remaining = session.status === "running" && session.endsAt
    ? Math.max(0, session.endsAt - now)
    : session.remainingMs;
  const focusedMs = session.durationMs > 0
    ? Math.max(0, session.durationMs - remaining)
    : Math.max(0, now - session.startedAt);
  const record = { id: session.id, startedAt: session.startedAt, endedAt: now, focusedMs, outcome };
  const next = { ...state, session: null, history: [record, ...state.history].slice(0, 500) };
  await chrome.alarms.clear(END_ALARM);
  await writeState(next);
  await applyPolicy(next);
  return next;
}
async function reconcile(): Promise<void> {
  const state = await readState();
  await chrome.alarms.create(SCHEDULE_ALARM, { periodInMinutes: 1 });
  if (state.session?.status === "running" && state.session.endsAt) {
    if (state.session.endsAt <= Date.now()) { await closeSession("completed"); return; }
    await chrome.alarms.create(END_ALARM, { when: state.session.endsAt });
  }
  await applyPolicy(state, true);
}
async function startSession(durationMinutes?: number, existingTabAction: ExistingTabAction = "redirect"): Promise<StilloraState> {
  if (durationMinutes !== undefined && (!Number.isFinite(durationMinutes) || durationMinutes < 1 || durationMinutes > 1440)) {
    throw new Error("Choose a duration between 1 and 1,440 minutes.");
  }
  const current = await readState();
  if (current.session) await closeSession("ended-early");
  const now = Date.now();
  const durationMs = durationMinutes === undefined ? 0 : Math.round(durationMinutes) * 60_000;
  const endsAt = durationMinutes === undefined ? null : now + durationMs;
  const session: FocusSession = { id: crypto.randomUUID(), status: "running", startedAt: now, endsAt, remainingMs: durationMs, durationMs };
  const next = { ...await readState(), session };
  await writeState(next);
  await chrome.alarms.clear(END_ALARM);
  if (session.endsAt) await chrome.alarms.create(END_ALARM, { when: session.endsAt });
  await applyPolicy(next, true, existingTabAction);
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
    case "GET_STATE": return readState();
    case "START_SESSION": return startSession(message.durationMinutes, message.existingTabAction ?? "redirect");
    case "PAUSE_SESSION": return pauseSession();
    case "RESUME_SESSION": return resumeSession();
    case "END_SESSION": return closeSession("ended-early");
    case "SAVE_WEBSITES": {
      const current = await readState();
      const normalized = message.websites.map((site) => ({ ...site, domain: normalizeDomain(site.domain) }));
      const unique = [...new Map(normalized.map((site) => [site.domain, site])).values()];
      const next = { ...current, websites: unique };
      await writeState(next); await applyPolicy(next, true); return next;
    }
    case "SAVE_SCHEDULES": {
      if (!message.schedules.every(isScheduleValid)) throw new Error("Check each schedule: choose a name, at least one day, and different valid start/end times.");
      const current = await readState();
      const next = { ...current, schedules: message.schedules };
      await writeState(next); await applyPolicy(next, true); return next;
    }
    case "SET_MODE": {
      const current = await readState();
      const next = { ...current, mode: message.mode };
      await writeState(next); await applyPolicy(next, true); return next;
    }
  }
}
chrome.runtime.onMessage.addListener((message: Message, _sender, respond) => {
  void handleMessage(message).then(respond).catch((error: unknown) => respond({ error: error instanceof Error ? error.message : "Unexpected error." }));
  return true;
});
chrome.runtime.onInstalled.addListener(() => { void reconcile(); });
chrome.runtime.onStartup.addListener(() => { void reconcile(); });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === END_ALARM) void closeSession("completed");
  if (alarm.name === SCHEDULE_ALARM) void readState().then((state) => applyPolicy(state, true));
});
void reconcile();
