import type { FocusSchedule } from "./types";

function toMinutes(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function isScheduleValid(schedule: FocusSchedule): boolean {
  const start = toMinutes(schedule.startTime);
  const end = toMinutes(schedule.endTime);
  return schedule.name.trim().length > 0 &&
    schedule.daysOfWeek.length > 0 &&
    schedule.daysOfWeek.every((day) => Number.isInteger(day) && day >= 0 && day <= 6) &&
    start !== null && end !== null && start !== end;
}

export function isScheduleActive(
  schedules: FocusSchedule[],
  date: Date = new Date()
): boolean {
  const day = date.getDay();
  const minute = date.getHours() * 60 + date.getMinutes();

  return schedules.some((schedule) => {
    if (!schedule.enabled || !isScheduleValid(schedule)) return false;
    const start = toMinutes(schedule.startTime)!;
    const end = toMinutes(schedule.endTime)!;

    if (start < end) {
      return schedule.daysOfWeek.includes(day) && minute >= start && minute < end;
    }

    const previousDay = (day + 6) % 7;
    return (
      (schedule.daysOfWeek.includes(day) && minute >= start) ||
      (schedule.daysOfWeek.includes(previousDay) && minute < end)
    );
  });
}
