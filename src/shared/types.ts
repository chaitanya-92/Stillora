export type BlockingMode = "blocklist" | "allowlist";
export type SessionStatus = "running" | "paused";
export interface Website { id: string; domain: string; enabled: boolean; createdAt: number; }
export interface FocusSession {
  id: string;
  status: SessionStatus;
  startedAt: number;
  endsAt: number | null;
  remainingMs: number;
  durationMs: number;
}
export interface FocusSchedule { id: string; name: string; daysOfWeek: number[]; startTime: string; endTime: string; enabled: boolean; }
export interface SessionRecord {
  id: string;
  startedAt: number;
  endedAt: number;
  focusedMs: number;
  outcome: "completed" | "ended-early";
}
export interface StilloraState {
  mode: BlockingMode;
  websites: Website[];
  session: FocusSession | null;
  history: SessionRecord[];
  schedules: FocusSchedule[];
}
export const DEFAULT_STATE: StilloraState = {
  mode: "blocklist",
  websites: [],
  session: null,
  history: [],
  schedules: []
};
export type Message =
  | { type: "GET_STATE" }
  | { type: "SAVE_WEBSITES"; websites: Website[] }
  | { type: "SET_MODE"; mode: BlockingMode }
  | { type: "START_SESSION"; durationMinutes: number }
  | { type: "PAUSE_SESSION" }
  | { type: "RESUME_SESSION" }
  | { type: "END_SESSION" }
  | { type: "SAVE_SCHEDULES"; schedules: FocusSchedule[] };