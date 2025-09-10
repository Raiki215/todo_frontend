"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";

interface NotificationButtonProps {
  onClick?: () => void;
  isActive?: boolean;
}

export default function NotificationButton({
  onClick,
  isActive = false,
}: NotificationButtonProps) {
  const { unreadCount, notificationsEnabled } = useAppStore();
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  // 現在の通知許可状態を確認
  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // パネル表示切り替えのみ
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // ベルアイコンの色を決定
  const getBellColor = () => {
    if (permission === "denied") {
      return "text-red-500"; // ブラウザで拒否されている
    } else if (permission === "granted" && notificationsEnabled) {
      return "text-green-500"; // 通知有効
    } else if (permission === "granted" && !notificationsEnabled) {
      return "text-red-500"; // アプリで無効
    } else {
      return "text-gray-500"; // 未設定
    }
  };

  // 通知が無効かどうか
  const isNotificationDisabled = 
    permission === "denied" || !notificationsEnabled;

  return (
    <button
      onClick={handleClick}
      className={`relative p-2 rounded-lg transition-colors hover:bg-gray-100 ${
        isActive ? "bg-gray-100" : ""
      }`}
      title="通知を開く"
    >
      {/* ベルアイコン */}
      <div className="relative">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={getBellColor()}
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        
        {/* 通知オフの場合の斜線 */}
        {isNotificationDisabled && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="absolute inset-0 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        )}
      </div>

      {/* 未読カウント */}
      {unreadCount > 0 && !isNotificationDisabled && (
        <span className="absolute -top-1 -right-1 px-1 py-0.5 text-xs bg-red-500 text-white rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
