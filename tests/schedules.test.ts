import { describe, expect, it } from "vitest";
import { isScheduleActive, isScheduleValid } from "../src/shared/schedules";
import type { FocusSchedule } from "../src/shared/types";

const weekdaySchedule: FocusSchedule = {
  id: "study",
  name: "Study hours",
  daysOfWeek: [1, 2, 3, 4, 5],
  startTime: "09:00",
  endTime: "17:00",
  enabled: true
};

describe("focus schedules", () => {
  it("activates during a configured weekday window", () => {
    expect(isScheduleActive([weekdaySchedule], new Date(2026, 10, 9, 10, 30))).toBe(true);
  });

  it("does not activate outside the configured time window", () => {
    expect(isScheduleActive([weekdaySchedule], new Date(2026, 10, 9, 18, 0))).toBe(false);
  });

  it("supports overnight schedules across midnight", () => {
    const overnight = { ...weekdaySchedule, daysOfWeek: [5], startTime: "22:00", endTime: "02:00" };
    expect(isScheduleActive([overnight], new Date(2026, 10, 7, 1, 0))).toBe(true);
  });

  it("ignores disabled schedules", () => {
    expect(isScheduleActive([{ ...weekdaySchedule, enabled: false }], new Date(2026, 10, 9, 10, 0))).toBe(false);
  });

  it("activates immediately when a schedule is manually started", () => {
    const now = new Date(2026, 10, 9, 8, 0);
    const manual = { ...weekdaySchedule, activeUntil: new Date(2026, 10, 9, 12, 0).getTime() };
    expect(isScheduleActive([manual], now)).toBe(true);
  });

  it("expires a manually started schedule at its end timestamp", () => {
    const expired = { ...weekdaySchedule, activeUntil: new Date(2026, 10, 9, 8, 0).getTime() };
    expect(isScheduleActive([expired], new Date(2026, 10, 9, 8, 1))).toBe(false);
  });

  it("rejects equal start and end times", () => {
    expect(isScheduleValid({ ...weekdaySchedule, endTime: "09:00" })).toBe(false);
  });
});
