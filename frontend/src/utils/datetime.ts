
export function parseApiDate(value: string): Date {
  const trimmed = value.trim();
  if (!trimmed) return new Date(Number.NaN);

  const hasTimezone = /Z$/i.test(trimmed) || /[+-]\d{2}:?\d{2}$/.test(trimmed);
  if (hasTimezone) {
    return new Date(trimmed);
  }

  const normalized = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  return new Date(`${normalized}Z`);
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "";
  const date = parseApiDate(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}
