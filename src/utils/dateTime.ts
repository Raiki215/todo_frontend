/**
 * 日時関連のユーティリティ関数
 */

/**
 * 現在の日付をYYYY-MM-DD形式で取得
 */
export function getCurrentDate(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

/**
 * 現在の時刻をHH:mm形式で取得
 */
export function getCurrentTime(): string {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

/**
 * 現在の日時をISO形式で取得
 */
export function getCurrentDateTime(): string {
  return new Date().toISOString();
}
