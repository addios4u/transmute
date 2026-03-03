export interface TimestampResult {
  unix: number;
  unixMs: number;
  iso: string;
  local: string;
  utc: string;
  relative: string;
}

export function isMilliseconds(value: number): boolean {
  // If the value is larger than year 2100 in seconds, it's likely milliseconds
  return value > 4_102_444_800;
}

export function normalizeToMs(value: number): number {
  return isMilliseconds(value) ? value : value * 1000;
}

export function timestampToDate(input: string): TimestampResult | null {
  const num = Number(input.trim());
  if (isNaN(num) || !isFinite(num)) return null;

  const ms = normalizeToMs(num);
  const date = new Date(ms);

  if (isNaN(date.getTime())) return null;

  return formatDate(date);
}

export function dateToTimestamp(date: Date): TimestampResult {
  return formatDate(date);
}

function formatDate(date: Date): TimestampResult {
  const ms = date.getTime();
  return {
    unix: Math.floor(ms / 1000),
    unixMs: ms,
    iso: date.toISOString(),
    local: date.toLocaleString(),
    utc: date.toUTCString(),
    relative: getRelativeTime(date),
  };
}

function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const absDiff = Math.abs(diff);
  const isFuture = diff < 0;

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let value: string;
  if (days > 365) {
    const years = Math.floor(days / 365);
    value = `${years} year${years > 1 ? "s" : ""}`;
  } else if (days > 30) {
    const months = Math.floor(days / 30);
    value = `${months} month${months > 1 ? "s" : ""}`;
  } else if (days > 0) {
    value = `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    value = `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    value = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    value = `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  return isFuture ? `in ${value}` : `${value} ago`;
}
