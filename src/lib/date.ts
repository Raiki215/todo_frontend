// lib/date.ts
export const fmtDate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const todayStr = () => {
  const now = new Date();
  // タイムゾーンを考慮した今日の日付を取得
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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

/**
 * タスクの残り時間を計算して文字列で返す
 * @param date タスクの日付 (YYYY-MM-DD)
 * @param time タスクの時刻 (HH:mm)
 * @returns 残り時間の文字列（例: "2時間30分", "今日", "過去"）
 */
export function calculateTimeRemaining(date: string, time?: string): string {
  const now = new Date();

  // タスクの日時を作成
  const taskDateTime = new Date(date);
  if (time) {
    const [hours, minutes] = time.split(":").map(Number);
    taskDateTime.setHours(hours, minutes, 0, 0);
  } else {
    // 時刻が指定されていない場合は23:59に設定
    taskDateTime.setHours(23, 59, 0, 0);
  }

  const diffMs = taskDateTime.getTime() - now.getTime();

  // 過去の場合
  if (diffMs < 0) {
    return "期限切れ";
  }

  // 分、時間、日数に変換
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // 表示形式を決定
  if (diffDays >= 1) {
    return `${diffDays}日後`;
  } else if (diffHours >= 1) {
    const remainingMinutes = diffMinutes % 60;
    if (remainingMinutes > 0) {
      return `${diffHours}時間${remainingMinutes}分`;
    } else {
      return `${diffHours}時間`;
    }
  } else if (diffMinutes >= 1) {
    return `${diffMinutes}分`;
  } else {
    return "まもなく";
  }
}

/**
 * 指定した日付から7日間の日付配列を返す
 * @param startDate 開始日 (YYYY-MM-DD)
 * @returns 7日間の日付文字列配列
 */
export function getWeekDates(startDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < 7; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    dates.push(fmtDate(current));
  }

  return dates;
}
