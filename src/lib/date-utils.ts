export function getMonthDays(year: number, month: number) {
  // month: 0-indexed
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay(); // 0=Sun
  const totalDays = lastDay.getDate();

  const days: { date: string; isCurrentMonth: boolean }[] = [];

  // Previous month padding
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: formatDate(d), isCurrentMonth: false });
  }

  // Current month
  for (let d = 1; d <= totalDays; d++) {
    days.push({
      date: formatDate(new Date(year, month, d)),
      isCurrentMonth: true,
    });
  }

  // Next month padding to fill 7×N grid
  while (days.length % 7 !== 0) {
    const d = new Date(year, month + 1, days.length - startDow - totalDays + 1);
    days.push({ date: formatDate(d), isCurrentMonth: false });
  }

  return days;
}

export function getWeekDays(baseDate: Date) {
  const dow = baseDate.getDay();
  const sunday = new Date(baseDate);
  sunday.setDate(baseDate.getDate() - dow);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return formatDate(d);
  });
}

export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatMonthLabel(year: number, month: number) {
  return `${year}년 ${month + 1}월`;
}

const IMPORTANCE_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function sortByImportance<T extends { importance: string }>(
  events: T[],
): T[] {
  return [...events].sort(
    (a, b) =>
      (IMPORTANCE_ORDER[a.importance] ?? 3) -
      (IMPORTANCE_ORDER[b.importance] ?? 3),
  );
}

export function formatWeekLabel(days: string[]) {
  const s = days[0].slice(5).replace("-", "/");
  const e = days[6].slice(5).replace("-", "/");
  return `${days[0].slice(0, 4)} ${s} – ${e}`;
}
