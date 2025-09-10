"use client";

import { getTimeAgo } from "@/hooks/useNotifications";
import { useTaskStore } from "@/lib/store";

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
  } = useTaskStore();

  if (notifications.length === 0) {
    return (
      <div className="absolute top-12 -right-4 sm:right-0 z-50 w-[calc(100vw-1rem)] sm:w-80 lg:w-96">
        <div className="px-4 py-6 bg-white border-2 border-gray-300 rounded-lg shadow-xl text-center">
          <p className="text-sm text-gray-500">通知がありません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-12 -right-4 sm:right-0 z-50 w-[calc(100vw-1rem)] sm:w-80 lg:w-96 space-y-2">
      {/* 通知パネル全体の枠 */}
      <div className="border-2 border-gray-300 rounded-lg shadow-xl bg-white">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
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
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded"
          >
            すべてクリア
          </button>
        </div>

        {/* 通知一覧 */}
        <div className="max-h-64 sm:max-h-96 overflow-y-auto">
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
                  markAsRead(notification.id);
                }
              }}
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

                  {/* 期限情報と通知時間を横並びに */}
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-600">
                      期限: {notification.task.date}{" "}
                      {notification.task.time || "23:59"}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      {getTimeAgo(notification.timestamp)}
                    </p>
                  </div>
                </div>

                {/* 閉じるボタン */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded"
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
