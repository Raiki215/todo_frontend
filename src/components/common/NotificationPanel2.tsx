"use client";

import { useNotifications } from "@/hooks/useNotifications";

interface NotificationPanelProps {
  onClose?: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const {
    notifications,
    removeNotification,
    markAsRead,
    clearAllNotifications,
    unreadCount,
  } = useNotifications();

  if (notifications.length === 0) {
    return (
      <>
        {/* 背景オーバーレイ */}
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-20"
          onClick={onClose}
        />
        <div className="fixed top-4 right-4 z-50 w-80">
          <div className="px-4 py-6 bg-white border border-gray-200 rounded-lg shadow-lg text-center">
            <p className="text-sm text-gray-500">通知がありません</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* 背景オーバーレイ */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-20"
        onClick={onClose}
      />
      <div className="fixed top-4 right-4 z-50 w-80 space-y-2">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-800">通知</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={clearAllNotifications}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            すべてクリア
          </button>
        </div>

        {/* 通知一覧 */}
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border rounded-lg shadow-lg relative ${
              notification.isRead ? "bg-white" : "bg-cyan-50 border-cyan-200"
            } ${
              notification.type === "overdue"
                ? notification.isRead
                  ? "border-red-200"
                  : "border-red-300"
                : notification.isRead
                ? "border-yellow-200"
                : "border-yellow-300"
            }`}
            onClick={() => !notification.isRead && markAsRead(notification.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* 通知タイプ */}
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
                <p className="text-sm font-medium text-gray-800 mb-1">
                  {notification.task.title}
                </p>

                {/* 期限情報 */}
                <p className="text-xs text-gray-600 mb-2">
                  期限: {notification.task.date}{" "}
                  {notification.task.time || "23:59"}
                </p>

                {/* 現在時刻 */}
                <p className="text-xs text-gray-500">
                  {notification.timestamp.toLocaleString("ja-JP")}
                </p>
              </div>

              {/* 閉じるボタン */}
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-gray-400 hover:text-gray-600"
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

            {/* 優先度表示 */}
            {notification.task.priority && (
              <div className="mt-2 flex items-center gap-1">
                <span className="text-xs text-gray-500">優先度:</span>
                <span className="text-xs">
                  {"⭐️".repeat(notification.task.priority)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
