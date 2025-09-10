/**
 * 通知パネルコンポーネント
 *
 * 通知一覧の表示、既読/未読管理、個別削除機能を提供
 * ドロップダウン形式で通知詳細を表示
 */

"use client";

import { useAppStore } from "@/lib/store";

/**
 * 時間の差を「○分前」形式で表示する関数
 * @param timestamp - 通知のタイムスタンプ
 * @returns 相対時間の文字列
 */
export function getTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - timestamp.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "たった今";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分前`;
  } else if (diffInHours < 24) {
    return `${diffInHours}時間前`;
  } else {
    return `${diffInDays}日前`;
  }
}

interface NotificationPanelProps {
  /** パネルクローズ時のコールバック */
  onClose?: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const {
    notifications,
    removeNotification,
    markNotificationAsRead,
    clearAllNotifications,
    unreadCount,
    notificationsEnabled,
    toggleNotifications,
  } = useAppStore();

  // 通知が0件の場合の表示
  if (notifications.length === 0) {
    return (
      <div className="absolute left-0 right-0 z-50 mx-4 top-12 sm:left-auto sm:right-4 sm:mx-0 sm:w-80 lg:w-96">
        <div className="px-4 py-6 text-center bg-white border-2 border-gray-300 rounded-lg shadow-xl">
          <p className="text-sm text-gray-500">通知がありません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute left-0 right-0 z-50 mx-4 space-y-2 top-12 sm:left-auto sm:right-4 sm:mx-0 sm:w-80 lg:w-96">
      {/* 通知パネル全体の枠 */}
      <div className="bg-white border-2 border-gray-300 rounded-lg shadow-xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-800">通知</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* 通知オンオフ切り替えボタン */}
            <button
              onClick={toggleNotifications}
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                notificationsEnabled
                  ? "text-green-700 bg-green-100 hover:bg-green-200"
                  : "text-red-700 bg-red-100 hover:bg-red-200"
              }`}
              title={
                notificationsEnabled ? "通知を無効にする" : "通知を有効にする"
              }
            >
              {/* ベルアイコン */}
              <div className="relative">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {/* 通知オフの場合の斜線 */}
                {!notificationsEnabled && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    className="absolute inset-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                )}
              </div>
              {notificationsEnabled ? "ON" : "OFF"}
            </button>
            <button
              onClick={clearAllNotifications}
              className="px-2 py-1 text-xs text-gray-500 rounded hover:text-gray-700 hover:bg-gray-100"
            >
              すべてクリア
            </button>
          </div>
        </div>

        {/* 通知一覧 */}
        <div className="overflow-y-auto max-h-64 sm:max-h-96">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 last:border-b-0 relative cursor-pointer hover:bg-gray-50 ${
                notification.isRead ? "bg-white" : "bg-cyan-50"
              }`}
              onClick={() => {
                console.log(
                  "通知クリック:",
                  notification.id,
                  "既読状態:",
                  notification.isRead
                );
                if (!notification.isRead) {
                  markNotificationAsRead(notification.id);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* 通知タイプバッジ */}
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                      notification.type === "overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {notification.message}
                  </div>

                  {/* タスク内容 */}
                  <p className="mb-1 text-sm font-medium text-gray-800">
                    {notification.task.title}
                  </p>

                  {/* 期限情報と通知時間を横並びに */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-600">
                      期限: {notification.task.date}{" "}
                      {notification.task.time || "23:59"}
                    </p>
                    <p className="text-xs font-medium text-blue-600">
                      {getTimeAgo(notification.timestamp)}
                    </p>
                  </div>
                </div>

                {/* 削除ボタン */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  className="p-1 ml-2 text-gray-400 rounded hover:text-gray-600 hover:bg-gray-200"
                  aria-label="通知を削除"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
