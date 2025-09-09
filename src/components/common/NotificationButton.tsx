"use client";

import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationButtonProps {
  onClick?: () => void;
  isActive?: boolean;
}

export default function NotificationButton({ onClick, isActive = false }: NotificationButtonProps) {
  const { unreadCount } = useNotifications();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isChecking, setIsChecking] = useState(false);

  // 現在の通知許可状態を確認
  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // 通知許可を要求またはパネル表示切り替え
  const handleClick = async () => {
    if (permission === "granted" && onClick) {
      // 許可済みの場合はパネル表示切り替え
      onClick();
      return;
    }

    // 未許可の場合は許可要求
    if (!("Notification" in window)) {
      alert("このブラウザは通知をサポートしていません");
      return;
    }

    setIsChecking(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === "granted") {
        // テスト通知を表示
        new Notification("TODOアプリ: 通知が有効になりました", {
          body: "期限の30分前と期限切れ時に通知をお送りします",
          icon: "/favicon.ico",
        });
      }
    } catch (error) {
      console.error("通知許可の要求に失敗しました:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const getButtonText = () => {
    switch (permission) {
      case "granted":
        return "通知 ON";
      case "denied":
        return "通知 OFF";
      default:
        return "通知設定";
    }
  };

  const getButtonStyle = () => {
    const baseStyle = isActive ? "ring-2 ring-blue-500 ring-opacity-50" : "";
    switch (permission) {
      case "granted":
        return `bg-green-600 hover:bg-green-700 text-white ${baseStyle}`;
      case "denied":
        return `bg-red-600 hover:bg-red-700 text-white ${baseStyle}`;
      default:
        return `bg-gray-600 hover:bg-gray-700 text-white ${baseStyle}`;
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isChecking}
      className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg shadow-sm whitespace-nowrap transition-colors relative ${getButtonStyle()} ${
        isChecking ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {/* 通知アイコン */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        {permission === "denied" && (
          <line x1="18" y1="6" x2="6" y2="18" />
        )}
      </svg>
      
      {isChecking ? "設定中..." : getButtonText()}
      
      {/* 未読カウント */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 px-1 py-0.5 text-xs bg-red-500 text-white rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
