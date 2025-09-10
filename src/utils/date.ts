/**
 * 日付関連のユーティリティ関数
 *
 * 日付のフォーマット、計算、表示関連の処理をまとめたモジュール
 */

/**
 * Date オブジェクトを YYYY-MM-DD 形式の文字列に変換
 * @param date - 変換対象の Date オブジェクト
 * @returns YYYY-MM-DD 形式の日付文字列
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Date オブジェクトを YYYY-MM-DD 形式の文字列に変換（別名）
 * 互換性のためのエイリアス
 * @param date - 変換対象の Date オブジェクト
 * @returns YYYY-MM-DD 形式の日付文字列
 */
export const fmtDate = formatDate;

/**
 * 今日の日付を YYYY-MM-DD 形式で取得
 * タイムゾーンを考慮した現在日付を返す
 * @returns 今日の日付文字列
 */
export const todayStr = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * 指定された月数だけ月を加算した新しい Date オブジェクトを作成
 * @param date - 基準となる日付
 * @param months - 加算する月数（負の値で過去の月）
 * @returns 計算後の Date オブジェクト
 */
export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

/**
 * 指定された月の月初から、その週の日曜日までの開始日を取得
 * カレンダーグリッド表示用
 * @param date - 対象の月を含む日付
 * @returns グリッドの開始日
 */
export function startOfMonthGrid(date: Date): Date {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
  return startDate;
}

/**
 * 月表示カレンダー用の42日分の日付配列を生成
 * @param date - 対象の月を含む日付
 * @returns 42日分の Date オブジェクト配列
 */
export function buildMonthGrid(date: Date): Date[] {
  const start = startOfMonthGrid(date);
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

/**
 * タスクの残り時間を計算して読みやすい文字列で返す
 * @param date - タスクの日付 (YYYY-MM-DD)
 * @param time - タスクの時刻 (HH:mm) - 省略可能
 * @returns 残り時間の文字列（例: "2時間30分", "1日後", "期限切れ"）
 */
export function calculateTimeRemaining(date: string, time?: string): string {
  const now = new Date();

  // タスクの日時を構築
  const taskDateTime = new Date(date);
  if (time) {
    const [hours, minutes] = time.split(":").map(Number);
    taskDateTime.setHours(hours, minutes, 0, 0);
  } else {
    // 時刻未指定の場合は23:59に設定
    taskDateTime.setHours(23, 59, 0, 0);
  }

  const diffMs = taskDateTime.getTime() - now.getTime();

  // 期限切れの場合
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
    return remainingMinutes > 0
      ? `${diffHours}時間${remainingMinutes}分`
      : `${diffHours}時間`;
  } else if (diffMinutes >= 1) {
    return `${diffMinutes}分`;
  } else {
    return "まもなく";
  }
}

/**
 * 指定した開始日から7日間の日付配列を生成
 * 週表示用
 * @param startDate - 開始日 (YYYY-MM-DD)
 * @returns 7日間の日付文字列配列
 */
export function getWeekDates(startDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < 7; i++) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    dates.push(formatDate(current));
  }

  return dates;
}

/**
 * 日付を日本語形式でフォーマット
 * @param dateStr - YYYY-MM-DD 形式の日付文字列
 * @returns 日本語形式の日付文字列（例: "2025年9月10日月曜日"）
 */
export function formatJapaneseDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[date.getDay()];

  return `${year}年${month}月${day}日${weekday}曜日`;
}

/**
 * 指定された日数だけ現在日付からオフセットした日付文字列を生成
 * @param deltaDays - オフセット日数（正の値で未来、負の値で過去）
 * @returns YYYY-MM-DD形式の日付文字列
 */
export function formatDateOffset(deltaDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + deltaDays);
  return formatDate(date);
}
