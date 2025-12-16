export function toISODateInput(d = new Date()): string {
  // yyyy-MM-dd
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function monthKeyFromDate(date: Date): { year: number; month: number } {
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function startEndOfMonth(year: number, month: number): { start: Date; end: Date } {
  // month 1-12
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 1, 0, 0, 0, 0); // exclusive
  return { start, end };
}

export function inRangeISO(iso: string, start: Date, endExclusive: Date): boolean {
  const d = new Date(iso);
  return d >= start && d < endExclusive;
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

export function formatMonthTitle(year: number, month: number): string {
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}
