// lib/date.ts
export const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

export const todayStr = () => fmtDate(new Date());

export function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export function startOfMonthGrid(d: Date) {
  // 月初(1日)から、その週の「日曜日」まで戻る
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay()); // 0=日
  return start;
}

export function buildMonthGrid(d: Date) {
  const start = startOfMonthGrid(d);
  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
}
